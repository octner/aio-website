// Figures that a Markdown page can ask for. The page text holds a marker; the template replaces it.
//   <div data-diagram="donation-journey"></div>      a diagram of the learning system (src/assets/diagrams/)
//   ![All pages of the site](docs/site-graph.svg)      the page graph that scripts/site-graph.mjs writes
// The diagrams are copies of the learning system's app/assets/graphics/diagrams/ (built there from
// content/graphics/graphics.json). The text column is too narrow for the wide versions, so the site
// keeps the vertical "-v" version where the learning system has one. A diagram without one (research-cycle)
// scrolls sideways on phones instead of shrinking. Its viewBox is cropped to its drawing.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIAGRAMS = join(process.cwd(), 'src/assets/diagrams');
const GRAPH = join(process.cwd(), 'docs/site-graph.svg');

// Titles as in the learning system's graphics.json.
const titles: Record<string, string> = {
  'donation-journey': 'One data donation, start to finish',
  'platform-workflow': 'Running a DDP study on the AIO Platform',
  'two-lenses': 'Two ways to observe platforms',
  'research-cycle': 'Where the training modules sit in a study',
};

// Inlined SVGs lose the fixed width and height of their root element, so the CSS width sets the
// size and the height follows the viewBox. With the fixed height, a narrowed diagram gets empty bands.
const read = (file: string) =>
  existsSync(file) ? readFileSync(file, 'utf8').replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\s(width|height)="[^"]*"/g, '')) : '';

function diagramFigure(id: string): string {
  const tall = read(join(DIAGRAMS, `${id}-v.svg`));
  const svg = tall || read(join(DIAGRAMS, `${id}.svg`));
  if (!svg) throw new Error(`Unknown diagram "${id}": add src/assets/diagrams/${id}-v.svg or ${id}.svg`);
  return `<figure class="figure-diagram${tall ? ' figure-tall' : ''}"><div class="figure-scroll">${svg}</div><figcaption>${titles[id] ?? ''}</figcaption></figure>`;
}

/** The page graph, wrapped so that it scrolls sideways on narrow screens instead of shrinking. */
export function siteGraphFigure(): string {
  const svg = read(GRAPH);
  if (!svg) throw new Error('docs/site-graph.svg is missing: run "node scripts/site-graph.mjs"');
  return `<figure class="site-graph"><div class="site-graph-scroll">${svg}</div><figcaption>All pages of the new site. Select a page to open it. The colour of a box shows the status of its text.</figcaption></figure>`;
}

export function withFigures(html: string): string {
  return html
    .replace(/<div data-diagram="([\w-]+)"><\/div>/g, (_, id) => diagramFigure(id))
    // Astro turns a relative Markdown image into <img __ASTRO_IMAGE_="{...docs/site-graph.svg...}">.
    .replace(/(?:<p>\s*)?<img\b[^>]*docs\/site-graph\.svg[^>]*>(?:\s*<\/p>)?/g, () => siteGraphFigure());
}
