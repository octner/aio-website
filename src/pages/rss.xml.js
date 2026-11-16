import rss from '@astrojs/rss';
import site from '../data/site.json';
import { publishedPosts, postUrl } from '../lib/content';

export async function GET(context) {
  // RSS needs full addresses, so the sub-path is added here, not by scripts/postbuild.mjs.
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const posts = await publishedPosts();
  return rss({
    title: `${site.name} news`,
    description: site.description,
    site: new URL(base + '/', context.site),
    items: posts.slice(0, 30).map((p) => ({
      title: p.data.title,
      description: p.data.summary,
      pubDate: p.data.date,
      link: `${base}${postUrl(p)}`,
    })),
  });
}
