// Comment tools of the test version: click a part of a page to comment on it, or comment on the whole
// page or on the menu. Comments go into the shared comment store (comment-store.ts) and show on the page
// as numbered marks, with a list in the comment box at the foot of the page.
// Every stored text is shown with textContent, never as HTML, because anyone can write to the store.
import { listComments, addComment, type Kind, type NewComment, type StoredComment } from './comment-store';

// The parts of a page that a reviewer can select. A click picks the nearest one around the target.
const PARTS = 'p, li, h1, h2, h3, h4, dt, dd, blockquote, pre, figure, img, table, .person, .video, .event-box, .todo, .btn, summary, a';
const LABELS: Record<string, string> = {
  p: 'Paragraph', li: 'List item', h1: 'Title', h2: 'Heading', h3: 'Heading', h4: 'Heading', dt: 'Term', dd: 'Description',
  blockquote: 'Quotation', pre: 'Code', figure: 'Figure', img: 'Image', table: 'Table', a: 'Link', summary: 'Menu group',
};
const TOOLS = '.feedback, .comment-toggle, .comment-bar, .comment-dialog, .comment-badge, .test-banner';
const NAME_KEY = 'aio-comment-name';

let store = '';
let page = '';
let title = '';
let active = false;
let hovered: Element | null = null;
let draft: Omit<NewComment, 'comment' | 'name'> | null = null;

const $ = <T extends Element>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const squash = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
const shorten = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

/** The text of an element without the marks that this script and the section links add. */
function textOf(el: Element): string {
  if (el.localName === 'img') return squash(el.getAttribute('alt')) || (el.getAttribute('src') ?? '').split('/').pop() || '';
  const copy = el.cloneNode(true) as Element;
  copy.querySelectorAll('.comment-badge, .anchor').forEach((n) => n.remove());
  return squash(copy.textContent);
}

/** CSS path from the nearest element with an id. Built from tag names, which SVG elements also have. */
function selectorFor(el: Element): string {
  const parts: string[] = [];
  for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
    if (node.id) { parts.unshift('#' + CSS.escape(node.id)); break; }
    let n = 1;
    for (let s = node.previousElementSibling; s; s = s.previousElementSibling) if (s.localName === node.localName) n++;
    parts.unshift(`${node.localName}:nth-of-type(${n})`);
  }
  return parts.join(' > ');
}

/** Id of the last heading with an id at or before the element. */
function headingFor(el: Element): string {
  let id = '';
  for (const h of $$<HTMLElement>('main h2[id], main h3[id]')) {
    if (h === el || h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) id = h.id;
    else break;
  }
  return id;
}

function partAt(target: Element): Element | null {
  if (target.closest(TOOLS)) return null;
  const el = target.closest(PARTS);
  return el && el.closest('main, .site-header, .site-footer') ? el : null;
}

function describe(el: Element): { kind: Kind; target: string } {
  const label = el.classList.contains('person') ? 'Person' : el.classList.contains('video') ? 'Video' : el.classList.contains('btn') ? 'Button' : LABELS[el.localName] ?? 'Part';
  const where = el.closest('.site-header') ? 'Menu, ' : el.closest('.site-footer') ? 'Footer, ' : '';
  const target = `${where}${where ? label.toLowerCase() : label}: ${shorten(textOf(el), 90)}`;
  return { kind: el.closest('.site-header') ? 'menu' : 'element', target };
}

/** The page title with the design on screen, so the team knows which design a comment is about. */
const titleNow = () => `${title} (design ${(document.documentElement.dataset.design ?? '').toUpperCase()})`;

// ---------- the form ----------

function openForm(next: Omit<NewComment, 'comment' | 'name'>) {
  draft = next;
  const dialog = $<HTMLDialogElement>('[data-comment-dialog]')!;
  const form = $<HTMLFormElement>('[data-comment-form]', dialog)!;
  $('[data-comment-target]', dialog)!.textContent = `On: ${next.target}`;
  const quote = $<HTMLElement>('[data-comment-quote]', dialog)!;
  quote.textContent = next.quote;
  quote.hidden = !next.quote;
  $('[data-comment-error]', dialog)!.textContent = '';
  form.reset();
  try { (form.elements.namedItem('name') as HTMLInputElement).value = localStorage.getItem(NAME_KEY) ?? ''; } catch { /* storage blocked */ }
  dialog.showModal();
  (form.elements.namedItem('comment') as HTMLTextAreaElement).focus();
}

function forPage(kind: 'page' | 'menu') {
  setActive(false);
  openForm({ page, title, kind, target: kind === 'page' ? `The whole page: ${title}` : 'The menu', heading: '', selector: '', snippet: '', quote: '' });
}

async function send(form: HTMLFormElement) {
  if (!draft) return;
  const field = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement).value.trim();
  const button = $<HTMLButtonElement>('button[type="submit"]', form)!;
  const error = $('[data-comment-error]', form)!;
  const comment = field('comment');
  if (!comment) { error.textContent = 'Write a comment first.'; return; }
  const name = field('name');
  try { localStorage.setItem(NAME_KEY, name); } catch { /* storage blocked */ }
  button.disabled = true;
  error.textContent = 'Sending…';
  try {
    await addComment(store, { ...draft, title: titleNow(), comment, name, website: field('website') });
    $<HTMLDialogElement>('[data-comment-dialog]')!.close();
    draft = null;
    status('Your comment is saved in the shared file.');
    await refresh();
  } catch (e) {
    error.textContent = `The comment may not have been saved: ${(e as Error).message}. Check the list before you try again. Your text is still here.`;
    await refresh();
  } finally {
    button.disabled = false;
  }
}

// ---------- the mode for parts of the page ----------

function setActive(on: boolean) {
  active = on;
  document.body.classList.toggle('commenting', on);
  $('[data-comment-bar]')!.toggleAttribute('hidden', !on);
  const toggle = $<HTMLButtonElement>('.comment-toggle')!;
  toggle.setAttribute('aria-pressed', String(on));
  toggle.lastChild!.textContent = on ? 'Stop' : 'Comment';
  if (!on && hovered) { hovered.classList.remove('comment-hover'); hovered = null; }
}

function onClick(e: MouseEvent) {
  if (!active || !(e.target instanceof Element)) return;
  const target = e.target;
  if (target.closest(TOOLS)) return;                // the comment tools work as usual
  if (target.closest('.site-header summary')) return; // menu groups still open, so their items can be selected
  e.preventDefault();
  e.stopPropagation();
  const el = partAt(target);
  if (!el) return;
  const quote = shorten(squash(String(window.getSelection() ?? '')), 600);
  const { kind, target: what } = describe(el);
  openForm({ page, title, kind, target: what, heading: headingFor(el), selector: selectorFor(el), snippet: textOf(el).slice(0, 120), quote });
}

function onOver(e: MouseEvent) {
  if (!active || !(e.target instanceof Element)) return;
  const el = partAt(e.target);
  if (el === hovered) return;
  hovered?.classList.remove('comment-hover');
  hovered = el;
  el?.classList.add('comment-hover');
}

// ---------- showing the comments ----------

function status(text: string) {
  const s = $('[data-comment-status]');
  if (s) s.textContent = text;
}

/** The element that a stored comment points to, if the page still has it. */
function locate(c: StoredComment): Element | null {
  if ((c.kind !== 'element' && c.kind !== 'menu') || !c.selector || (c.kind === 'element' && c.page !== page)) return null;
  let el: Element | null = null;
  try { el = document.querySelector(c.selector); } catch { return null; }
  return el && textOf(el).startsWith(squash(c.snippet).slice(0, 40)) ? el : null;
}

function flash(el: Element) {
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.add('comment-flash');
  setTimeout(() => el.classList.remove('comment-flash'), 1600);
}

function render(comments: StoredComment[]) {
  $$('.comment-badge').forEach((b) => b.remove());
  $$('.has-comment').forEach((el) => el.classList.remove('has-comment'));
  const list = $<HTMLOListElement>('[data-comment-list]')!;
  list.replaceChildren();
  comments.forEach((c, i) => {
    const n = String(i + 1);
    const li = document.createElement('li');
    li.id = `comment-${c.id}`;
    const head = document.createElement('p');
    head.className = 'comment-on';
    head.textContent = c.kind === 'menu' && c.page !== page ? `${c.target} (from ${c.page})` : c.target;
    li.append(head);
    if (c.quote) { const q = document.createElement('blockquote'); q.textContent = c.quote; li.append(q); }
    const body = document.createElement('p');
    body.textContent = c.comment;
    li.append(body);
    const meta = document.createElement('p');
    meta.className = 'comment-meta';
    const when = new Date(c.time);
    meta.textContent = [c.name || 'Anonymous', isNaN(when.valueOf()) ? '' : when.toLocaleDateString('en-AU'), c.status === 'done' ? 'Done' : ''].filter(Boolean).join(' · ');
    li.append(meta);
    const el = locate(c);
    if (el) {
      el.classList.add('has-comment');
      const badge = document.createElement('button');
      badge.type = 'button';
      badge.className = 'comment-badge';
      badge.textContent = n;
      badge.setAttribute('aria-label', `Comment ${n}: show it in the list`);
      badge.addEventListener('click', () => flash(li));
      const interactive = el.closest('a, button, summary');
      if (interactive) interactive.after(badge);
      else if (el.localName === 'img' || el.localName === 'table') el.after(badge);
      else el.append(badge);
      const show = document.createElement('button');
      show.type = 'button';
      show.className = 'comment-show';
      show.textContent = 'Show on the page';
      show.addEventListener('click', () => flash(el));
      meta.append(' · ', show);
    }
    list.append(li);
  });
  status(comments.length ? `${comments.length} comment${comments.length === 1 ? '' : 's'} on this page and the menu.` : 'No comments on this page yet.');
}

async function refresh() {
  try { render(await listComments(store, page)); }
  catch (e) { status(`The comments could not be loaded: ${(e as Error).message}.`); }
}

// ---------- the review page: answers to the eight questions ----------

function initReview() {
  const form = $<HTMLFormElement>('[data-review-form]');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const out = $('[data-review-status]', form)!;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const website = (form.elements.namedItem('website') as HTMLInputElement).value;
    const answers = $$<HTMLTextAreaElement>('textarea[data-question]', form).filter((t) => t.value.trim());
    if (!answers.length) { out.textContent = 'Answer at least one question first.'; return; }
    const button = $<HTMLButtonElement>('button[type="submit"]', form)!;
    button.disabled = true;
    out.textContent = 'Sending…';
    try {
      for (const t of answers) {
        await addComment(store, { page, title: titleNow(), kind: 'question', target: t.dataset.question!, heading: '', selector: '', snippet: '', quote: '', comment: t.value.trim(), name, website });
        t.value = '';
      }
      out.textContent = `Thank you. ${answers.length} answer${answers.length === 1 ? ' is' : 's are'} saved in the shared file.`;
      await refresh();
    } catch (err) {
      out.textContent = `Some answers may not have been saved: ${(err as Error).message}. An answer that is still in its box may have been saved, so check the comments before you try again.`;
      await refresh();
    } finally {
      button.disabled = false;
    }
  });
}

export function initComments() {
  const box = $<HTMLElement>('.feedback[data-comments]');
  if (!box?.dataset.comments) return;
  store = box.dataset.comments;
  page = box.dataset.page ?? '/';
  title = box.dataset.title ?? document.title;

  $$('[data-comment-mode]').forEach((b) => b.addEventListener('click', () => setActive(!active)));
  $$('[data-comment-page]').forEach((b) => b.addEventListener('click', () => forPage('page')));
  $$('[data-comment-menu]').forEach((b) => b.addEventListener('click', () => forPage('menu')));
  $('[data-comment-stop]')?.addEventListener('click', () => setActive(false));

  const dialog = $<HTMLDialogElement>('[data-comment-dialog]')!;
  const form = $<HTMLFormElement>('[data-comment-form]', dialog)!;
  form.addEventListener('submit', (e) => { e.preventDefault(); send(form); });
  $('[data-comment-cancel]', dialog)!.addEventListener('click', () => dialog.close());

  // Capture phase, so the clicks of comment mode do not reach links, the video player or the menu script.
  window.addEventListener('click', onClick, true);
  window.addEventListener('mouseover', onOver, true);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && active && !dialog.open) setActive(false); });

  initReview();
  refresh();
}
