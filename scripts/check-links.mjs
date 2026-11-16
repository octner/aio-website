// Checks every internal link and image in the built site.
// Usage: BASE_PATH=/aio-website node scripts/check-links.mjs dist   (or with BASE_PATH empty)
// Also checks that every HTML page has a noindex tag in test mode.
// Fails if a link is broken, a sub-path is missing, or a test page lacks noindex.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const dist = process.argv[2] || 'dist';
const base = (process.env.BASE_PATH || '').replace(/\/+$/, '');
const { draft } = JSON.parse(await readFile(new URL('../src/data/site.json', import.meta.url), 'utf8'));

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(p);
    else if (entry.name.endsWith('.html')) yield p;
  }
}
const exists = async (p) => stat(p).then(() => true, () => false);

const problems = [];
let checked = 0;
let pages = 0;
const cache = new Map();

for await (const file of htmlFiles(dist)) {
  const html = await readFile(file, 'utf8');
  const page = '/' + relative(dist, file).replace(/index\.html$/, '').replace(/\\/g, '/');
  pages++;
  if (draft && !/<meta\s+name=["']robots["']\s+content=["'][^"']*\bnoindex\b[^"']*["']\s*\/?>/i.test(html)) {
    problems.push(`${page}: test page has no robots noindex tag`);
  }
  const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map((m) => m[1]));
  const urls = [
    ...[...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map((m) => m[1]),
    ...[...html.matchAll(/\bsrcset=["']([^"']+)["']/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0])),
  ];
  for (const raw of urls) {
    const url = raw.replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(url) || url.startsWith('//')) continue;
    if (url.startsWith('#')) {
      if (url.length > 1 && !ids.has(decodeURIComponent(url.slice(1)))) problems.push(`${page}: no element with id ${url}`);
      continue;
    }
    if (!url.startsWith('/')) continue; // relative links are not used by the templates
    checked++;
    if (base && !(url === base || url.startsWith(base + '/'))) {
      problems.push(`${page}: link without the sub-path ${base}: ${url}`);
      continue;
    }
    let path = url.slice(base.length).split('#')[0].split('?')[0];
    path = decodeURIComponent(path || '/');
    let target = join(dist, path);
    if (path.endsWith('/')) target = join(target, 'index.html');
    if (!cache.has(target)) cache.set(target, await exists(target));
    if (!cache.get(target)) problems.push(`${page}: broken link ${url}`);
  }
}

if (draft && pages === 0) problems.push('no HTML pages found to check for noindex');
if (problems.length) {
  console.error(`check-links: ${problems.length} problems in ${checked} internal links and ${pages} pages`);
  for (const p of [...new Set(problems)].slice(0, 200)) console.error('  ' + p);
  process.exit(1);
}
console.log(`check-links: all ${checked} internal links and images work${base ? ` under ${base}` : ''}`);
if (draft) console.log(`check-links: all ${pages} test HTML pages have a robots noindex tag`);
