// Writes docs/site-graph.svg: every page of the site as a graph, built from src/data/navigation.json
// and the "status" field of each page. Runs before each build (package.json), so the graph never
// goes out of date. The site shows it inline (/site-map/ and /plan/); GitHub shows it in PLAN.md.
// Style follows the learning system's diagrams: live text, 24 px line icons drawn inline,
// slate neutrals with one orange accent, Space Grotesk labels, a written alternative.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const nav = JSON.parse(readFileSync(join(root, 'src/data/navigation.json'), 'utf8'));
const sprite = readFileSync(join(root, 'public/graphics/icons.svg'), 'utf8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function icon(name, x, y, size, colour) {
  const m = sprite.match(new RegExp(`<symbol id="i-${name}"[^>]*>([\\s\\S]*?)</symbol>`));
  if (!m) throw new Error(`site-graph: no icon "${name}" in public/graphics/icons.svg`);
  const k = size / 24;
  return `<g transform="translate(${x} ${y}) scale(${k})" fill="none" stroke="${colour}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${m[1].replace(/currentColor/g, colour)}</g>`;
}

/** Front matter field of a Markdown file (simple "key: value" lines only). */
function field(file, key) {
  const fm = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  const m = fm && fm[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : undefined;
}

function pageFile(href) {
  const p = href.replace(/^\/|\/$/g, '');
  for (const f of [`${p}.md`, `${p}/index.md`]) {
    const file = join(root, 'src/content/pages', f);
    if (existsSync(file)) return file;
  }
  return undefined;
}

function countPublished(dir) {
  return readdirSync(join(root, dir)).filter((f) => f.endsWith('.md') && field(join(root, dir, f), 'draft') !== 'true').length;
}

const notes = {
  '/news/': `${countPublished('src/content/posts')} posts`,
  '/learn/resources/': `${countPublished('src/content/resources')} resources`,
};

const STATUS = {
  migrated: { fill: '#ffffff', stroke: '#cbd5e1', dash: '', label: 'Text from the current site' },
  edited: { fill: '#f0f9ff', stroke: '#7dd3fc', dash: '', label: 'Edited from the current site' },
  new: { fill: '#fffbeb', stroke: '#fbbf24', dash: '', label: 'New text, needs review' },
  placeholder: { fill: '#fff7ed', stroke: '#ea580c', dash: '5 4', label: 'To be written' },
};

/** Split a label into lines of at most `max` characters. */
function wrap(text, max) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > max) { lines.push(line); line = word; }
    else line = line ? line + ' ' + word : word;
  }
  if (line) lines.push(line);
  return lines;
}

// Pages with "hidden": true are out of the menus for now, so the graph leaves them out too.
const columns = [...nav.groups, nav.site].map((group) => ({ ...group, items: group.items.filter((item) => !item.hidden) }));
// Three groups per row keeps the graph narrow enough for the text column of a page.
const PER_ROW = 3, COL = 196, GAP = 18, PAD = 28, TRUNK_X = 12;
const width = PAD * 2 + PER_ROW * COL + (PER_ROW - 1) * GAP;
const HOME_Y = 18, GROUP_H = 58;
const HEAD = "'Space Grotesk', 'Inter Tight', Arial, sans-serif";
const BODY = "'Inter Tight', Arial, sans-serif";
const LINE = 'stroke="#cbd5e1" stroke-width="2" fill="none"';

const parts = [];
const alt = [];

// Home node; a trunk on the left edge joins it to the line above each row of groups.
const homeW = 168, homeX = width / 2 - homeW / 2;
parts.push(`<a href="/"><rect x="${homeX}" y="${HOME_Y}" width="${homeW}" height="52" rx="12" fill="#0f172a"/>`
  + icon('observatory', homeX + 18, HOME_Y + 14, 24, '#ffffff')
  + `<text x="${homeX + 54}" y="${HOME_Y + 32}" font-family="${HEAD}" font-size="17" font-weight="600" fill="#ffffff">Home page</text>`
  + `<circle cx="${homeX + homeW - 14}" cy="${HOME_Y + 12}" r="4" fill="#f97316"/></a>`);

/** Draws one group and its pages from (x, top); returns the y below its last page. */
function drawGroup(group, x, top) {
  const isFooter = group.label === nav.site.label;
  const glines = wrap(group.label, 15);
  parts.push(`<rect x="${x}" y="${top}" width="${COL}" height="${GROUP_H}" rx="12" fill="${isFooter ? '#475569' : '#0f172a'}"/>`
    + icon(group.icon, x + 14, top + 17, 24, '#ffffff')
    + `<text font-family="${HEAD}" font-size="15" font-weight="600" fill="#ffffff">`
    + glines.map((l, k) => `<tspan x="${x + 48}" y="${top + 34 - (glines.length - 1) * 9 + k * 18}">${esc(l)}</tspan>`).join('')
    + `</text>`);
  alt.push(`${group.label}${isFooter ? ' (footer)' : ''}: ${group.items.map((it) => it.label).join(', ')}.`);

  let y = top + GROUP_H + 14;
  const spineX = x + 14;
  let lastMidY = y;
  for (const item of group.items) {
    const file = pageFile(item.href);
    const s = STATUS[(file && field(file, 'status')) || 'migrated'] ?? STATUS.migrated;
    const lines = wrap(item.label, 17);
    const note = notes[item.href];
    const h = 20 + lines.length * 18 + (note ? 17 : 0);
    const nx = x + 28, nw = COL - 28;
    parts.push(`<path d="M${spineX} ${y + h / 2} H${nx}" ${LINE}/>`);
    parts.push(`<a href="${item.href}"><title>${esc(item.label)}: ${esc(s.label)}</title>`
      + `<rect x="${nx}" y="${y}" width="${nw}" height="${h}" rx="9" fill="${s.fill}" stroke="${s.stroke}" stroke-width="1.5"${s.dash ? ` stroke-dasharray="${s.dash}"` : ''}/>`
      + icon(item.icon, nx + 10, y + 11, 18, '#0f172a')
      + `<text font-family="${HEAD}" font-size="14" font-weight="600" fill="#020617">`
      + lines.map((l, k) => `<tspan x="${nx + 36}" y="${y + 24 + k * 18}">${esc(l)}</tspan>`).join('')
      + `</text>`
      + (note ? `<text x="${nx + 36}" y="${y + 24 + lines.length * 18}" font-family="${BODY}" font-size="12.5" fill="#475569">${esc(note)}</text>` : '')
      + `</a>`);
    lastMidY = y + h / 2;
    y += h + 10;
  }
  parts.push(`<path d="M${spineX} ${top + GROUP_H} V${lastMidY}" ${LINE}/>`);
  return y;
}

let top = HOME_Y + 52 + 40; // first row of groups
let busY = top - 20;
parts.push(`<path d="M${width / 2} ${HOME_Y + 52} V${busY}" ${LINE}/>`);
let bottom = top;
for (let r = 0; r * PER_ROW < columns.length; r++) {
  const row = columns.slice(r * PER_ROW, (r + 1) * PER_ROW);
  const mids = row.map((_, i) => PAD + i * (COL + GAP) + COL / 2);
  // Line above the row, joined to the trunk on the left.
  parts.push(`<path d="M${TRUNK_X} ${busY} H${mids[mids.length - 1]}" ${LINE}/>`);
  mids.forEach((m) => parts.push(`<path d="M${m} ${busY} V${top}" ${LINE}/>`));
  row.forEach((group, i) => { bottom = Math.max(bottom, drawGroup(group, PAD + i * (COL + GAP), top)); });
  if ((r + 1) * PER_ROW < columns.length) {
    const nextBus = bottom + 16;
    parts.push(`<path d="M${TRUNK_X} ${busY} V${nextBus}" ${LINE}/>`);
    busY = nextBus;
    top = nextBus + 20;
  }
}

// Legend
const legendY = bottom + 14;
// Two legend entries per line, so the legend fits the narrow graph.
Object.values(STATUS).forEach((s, k) => {
  const lx = PAD + (k % 2) * 300, ly = legendY + Math.floor(k / 2) * 24;
  parts.push(`<rect x="${lx}" y="${ly}" width="22" height="16" rx="4" fill="${s.fill}" stroke="${s.stroke}" stroke-width="1.5"${s.dash ? ` stroke-dasharray="4 3"` : ''}/>`
    + `<text x="${lx + 30}" y="${ly + 13}" font-family="${BODY}" font-size="13" fill="#475569">${esc(s.label)}</text>`);
});
const height = legendY + 56;

const title = `All pages of the AIO website: the home page and ${columns.length} groups. ${alt.join(' ')}`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${esc(title)}" class="graph">`
  + `<title>${esc(title)}</title><rect width="${width}" height="${height}" fill="#ffffff"/>${parts.join('')}</svg>\n`;

mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(join(root, 'docs/site-graph.svg'), svg);
console.log(`site-graph: docs/site-graph.svg (${columns.length} groups, ${columns.reduce((n, g) => n + g.items.length, 0)} pages)`);
