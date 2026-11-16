// Runs after "astro build", before Pagefind. Three jobs:
// 1. The sitemap lists only real pages: without redirect pages for old addresses or review pages.
// 2. While the site is a GitHub Pages project site, it lives under a sub-path such as /aio-website/.
//    Templates and Markdown write links from the site root ("/news/"), so this step adds the sub-path
//    to every root-relative link in the built HTML. Links that already start with the sub-path are
//    left alone, so running it twice is safe. With BASE_PATH empty (custom domain) it changes nothing.
// 3. Remove Finder metadata and Git directory placeholders copied from public/.
import { readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = process.argv[2] || 'dist';
const base = (process.env.BASE_PATH || '').replace(/\/+$/, '');

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(p);
    else if (entry.name.endsWith('.html')) yield p;
  }
}

async function cleanSitemap() {
  const file = join(dist, 'sitemap-0.xml');
  let xml;
  try { xml = await readFile(file, 'utf8'); } catch { return; }
  const urls = [...xml.matchAll(/<url>.*?<\/url>/gs)].map((m) => m[0]);
  const keep = [];
  for (const u of urls) {
    const path = new URL(u.match(/<loc>(.*?)<\/loc>/)[1]).pathname.slice(base.length) || '/';
    if (['/plan/', '/review/', '/site-map/', '/editor/'].includes(path)) continue;
    const html = await readFile(join(dist, path, 'index.html'), 'utf8').catch(() => '');
    if (!html.includes('http-equiv="refresh"')) keep.push(u);
  }
  await writeFile(file, xml.replace(/<url>.*<\/url>/s, keep.join('')));
  console.log(`postbuild: sitemap lists ${keep.length} of ${urls.length} addresses (redirect and review pages left out)`);
}

async function addSubPath() {
  let files = 0;
  let changed = 0;
  const prefix = (url) => {
    if (!url.startsWith('/') || url.startsWith('//') || url === base || url.startsWith(base + '/')) return url;
    changed++;
    return base + url;
  };
  for await (const file of htmlFiles(dist)) {
    files++;
    const html = await readFile(file, 'utf8');
    const out = html
      // href, src, action and poster attributes
      .replace(/\b(href|src|action|poster)=(["'])(\/[^"']*)\2/g, (_, attr, q, url) => `${attr}=${q}${prefix(url)}${q}`)
      // srcset: a list of "address width" pairs
      .replace(/\bsrcset=(["'])([^"']*)\1/g, (_, q, list) => `srcset=${q}${list.replace(/(^|,\s*)(\/[^\s,]+)/g, (__, sep, url) => sep + prefix(url))}${q}`)
      // <meta http-equiv="refresh" content="0; url=/new/">
      .replace(/(content=(["'])\d+;\s*url=)(\/[^"']*)\2/gi, (_, head, q, url) => `${head}${prefix(url)}${q}`);
    if (out !== html) await writeFile(file, out);
  }
  console.log(`postbuild: added ${base} to ${changed} links in ${files} HTML files`);
}

async function removeLocalFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await removeLocalFiles(path);
    else if (entry.isFile() && ['.DS_Store', '.gitkeep'].includes(entry.name)) await unlink(path);
  }
}

await cleanSitemap();
if (base) await addSubPath();
else console.log('postbuild: no BASE_PATH, links left as they are');
await removeLocalFiles(dist);
