// Content schema. Every Markdown file is checked against these fields when the site is built.
// A missing or wrong field stops the build and names the file, so a broken page never goes live.
// Keep these fields in step with .pages.yml (the browser editor forms).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Editors may leave an optional field empty ("image:"). YAML reads that as null.
const optionalText = z.string().nullish().transform((v) => v || undefined);
const optionalDate = z.coerce.date().nullish().transform((v) => v || undefined);

// How far a text has come from the current WordPress site. Shown to reviewers in the test version only.
const status = z.enum(['migrated', 'edited', 'new', 'placeholder']).default('migrated');

// Old WordPress addresses that must redirect to this item, for example "/faq/".
const legacy = z.array(z.string().startsWith('/')).nullish().transform((v) => v ?? []);

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: optionalText,
    // A listing that the template adds below the text of the page.
    listing: z
      .enum(['news', 'events', 'case-studies', 'resources', 'training', 'search', 'review', 'site-map', 'editor'])
      .nullish()
      .transform((v) => v || undefined),
    status,
    source: optionalText, // address on the current site that the text comes from
    legacy,
    // Show each level-3 heading with its photo as a card, two to a row (the Team page)
    people: z.boolean().default(false),
    // Home page only: the intro video, the three "Where to start" tiles and the "What AIO offers" blocks
    video: optionalText, // YouTube video id
    videoTitle: optionalText,
    start: z
      .array(z.object({ who: z.string(), title: z.string(), text: z.string(), href: z.string() }))
      .nullish()
      .transform((v) => v ?? []),
    blocks: z
      .array(z.object({ title: z.string(), text: z.string(), href: z.string(), link: z.string(), icon: z.string() }))
      .nullish()
      .transform((v) => v ?? []),
  }),
});

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(['news', 'event', 'case-study']).default('news'),
    summary: optionalText,
    image: optionalText,
    imageAlt: optionalText,
    author: optionalText,
    // Events only
    eventStart: optionalDate,
    eventEnd: optionalDate,
    allDay: z.boolean().default(false), // true: show the event dates without a time
    location: optionalText,
    registration: optionalText,
    // A republished article: name and address of the original
    originalSource: optionalText,
    originalUrl: optionalText,
    draft: z.boolean().default(false),
    status,
    legacy,
  }),
});

const resources = defineCollection({
  loader: glob({ base: './src/content/resources', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // Diátaxis kind: what the reader needs from this resource
    kind: z.enum(['tutorial', 'how-to', 'explanation', 'reference']),
    format: z.enum(['guide', 'explainer', 'video', 'faq', 'article']).default('guide'),
    summary: optionalText,
    draft: z.boolean().default(false),
    status,
    legacy,
  }),
});

// The plan for the new site (PLAN.md in the repository root), shown at /plan/ in the test version.
const plan = defineCollection({
  loader: glob({ base: '.', pattern: 'PLAN.md' }),
  schema: z.object({ title: z.string(), summary: optionalText }),
});

export const collections = { pages, posts, resources, plan };
