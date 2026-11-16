import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type Resource = CollectionEntry<'resources'>;
export type PageEntry = CollectionEntry<'pages'>;

/** Public path of a page file: about/team.md becomes /about/team/, about/index.md becomes /about/. */
export function pageUrlFromFile(entry: PageEntry): string {
  const p = (entry.filePath ?? entry.id)
    .replace(/\\/g, '/')
    .replace(/^.*?src\/content\/pages\//, '')
    .replace(/\.md$/, '')
    .replace(/(^|\/)index$/, '');
  return p ? `/${p}/` : '/';
}

export async function allPages() {
  const pages = await getCollection('pages');
  return pages.map((entry) => ({ entry, path: pageUrlFromFile(entry) }));
}

const newestFirst = (a: { data: { date: Date } }, b: { data: { date: Date } }) => b.data.date.valueOf() - a.data.date.valueOf();

export async function publishedPosts() {
  return (await getCollection('posts', ({ data }) => !data.draft)).sort(newestFirst);
}

export async function publishedResources() {
  return (await getCollection('resources', ({ data }) => !data.draft)).sort(newestFirst);
}

export const postUrl = (p: Post) => `/news/${p.id}/`;
export const resourceUrl = (r: Resource) => `/learn/resources/${r.id}/`;

/** Start of an event, or the publication date for other posts. */
export const eventDate = (p: Post) => p.data.eventStart ?? p.data.date;

/** An event is upcoming until it ends. The site rebuilds every night (deploy.yml), so the lists stay current. */
export const isUpcoming = (p: Post, now = new Date()) => p.data.type === 'event' && (p.data.eventEnd ?? eventDate(p)) >= now;

type Heading = { depth: number; slug: string; text: string };

/** Level-2 headings of a rendered entry, for the "On this page" list. */
export function sectionHeadings(entry: { rendered?: { metadata?: Record<string, unknown> } }): Heading[] {
  const headings = (entry.rendered?.metadata?.headings ?? []) as Heading[];
  return headings.filter((h) => h.depth === 2);
}
