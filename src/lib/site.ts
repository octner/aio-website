import site from '../data/site.json';
import nav from '../data/navigation.json';

export { site, nav };

export type NavItem = { label: string; href: string; icon: string; description: string };
export type NavGroup = { label: string; icon: string; items: NavItem[] };

// Templates and Markdown write links from the site root ("/news/"). scripts/postbuild.mjs adds the
// GitHub Pages sub-path ("/aio-website") after the build. Only the few places that need a full
// address (canonical link, RSS) use BASE here.
export const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

/** Path of the current page without the sub-path, for example "/about/team/". */
export function pagePath(url: URL): string {
  const p = BASE && url.pathname.startsWith(BASE + '/') ? url.pathname.slice(BASE.length) : url.pathname;
  return p.endsWith('/') || p.includes('.') ? p : p + '/';
}

/** Full public address of the current page. */
export function absoluteUrl(url: URL, siteUrl: URL | undefined): string {
  return (siteUrl?.origin ?? 'https://internetobservatory.org.au') + BASE + pagePath(url);
}

/** The groups a page can belong to: the five menu groups, the footer pages, and (in the test version) the review pages. */
export function sections(): NavGroup[] {
  return [...nav.groups, nav.site, ...(site.draft ? [nav.draftReview] : [])];
}

/** The section that holds a path: an exact match, or the closest parent (a news post belongs to "News"). */
export function sectionFor(path: string): { group: NavGroup; item: NavItem } | undefined {
  let best: { group: NavGroup; item: NavItem } | undefined;
  for (const group of sections()) {
    for (const item of group.items) {
      if (item.href === path) return { group, item };
      const isParent = item.href !== '/' && path.startsWith(item.href);
      if (isParent && (!best || item.href.length > best.item.href.length)) best = { group, item };
    }
  }
  return best;
}

const dateFormat = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Melbourne' });
const shortDateFormat = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Australia/Melbourne' });
export const formatDate = (d: Date) => dateFormat.format(d);
export const formatDateShort = (d: Date) => shortDateFormat.format(d);

export const typeLabel = { news: 'News', event: 'Event', 'case-study': 'Case study' } as const;
export const kindLabel = { tutorial: 'Tutorials', 'how-to': 'How-to guides', explanation: 'Explanations', reference: 'Reference' } as const;
export const kindIntro = {
  tutorial: 'Learn by doing, step by step.',
  'how-to': 'Practical help with one task.',
  explanation: 'Background that builds understanding.',
  reference: 'Facts to look up.',
} as const;
export const statusLabel = {
  migrated: 'Text from the current site',
  edited: 'Edited from the current site',
  new: 'New text, needs review',
  placeholder: 'To be written',
} as const;
export type Status = keyof typeof statusLabel;

/**
 * Imported posts take their summary from their first paragraph.
 * Show the summary under the title only when the text does not already start with it.
 */
export function summaryIsNew(summary: string | undefined, body: string | undefined): boolean {
  if (!summary) return false;
  const plain = (s: string) => s.replace(/[*_`[\]]|\([^)]*\)/g, '').replace(/\s+/g, ' ');
  return !plain(body ?? '').includes(plain(summary).replace(/…$/, '').slice(0, 80));
}

/** Link to the source file in GitHub's file editor, once the repository is set. */
export function editUrl(file: string | undefined): string | undefined {
  if (!site.repository || !file) return undefined;
  return `https://github.com/${site.repository}/edit/${site.branch}/${file}`;
}
