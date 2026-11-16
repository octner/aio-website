// The post editor of the test version (/editor/). It sends a new or edited post to the store
// (docs/feedback/posts.gs), which adds it to the "Posts" tab of the shared sheet for approval.
// The ids of the posts sent from this browser are kept in localStorage, so the page can show their status.

interface Fields { [key: string]: string }
interface Source { slug: string; sha: string; fields: Fields; body: string }
interface Sent { id: string; title: string; time: string }

const SENT_KEY = 'aio-post-sent';
const NAME_KEY = 'aio-comment-name';
const TEXT_FIELDS = ['title', 'date', 'type', 'summary', 'author', 'image', 'imageAlt', 'eventStart', 'eventEnd', 'location', 'registration'];
const STATUS: Record<string, string> = {
  submitted: 'Waiting for approval',
  approve: 'Approved, being published',
  publishing: 'Being published',
  published: 'Published',
  conflict: 'Not published: the post changed after this page was built. Reload the editor and make the change again.',
  error: 'Not published because of an error',
  rejected: 'Not accepted',
};

const read = <T>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? '') as T; } catch { return fallback; }
};
const readText = (key: string) => {
  try { return localStorage.getItem(key) ?? ''; } catch { return ''; }
};
const write = (key: string, value: unknown) => {
  try { localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)); } catch { /* storage blocked */ }
};

export function initPostEditor() {
  const form = document.querySelector<HTMLFormElement>('[data-post-editor]');
  if (!form) return;
  const store = form.dataset.store!;
  const posts: Source[] = JSON.parse(form.querySelector('[data-post-data]')!.textContent || '[]');
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  const box = (name: string) => form.elements.namedItem(name) as HTMLInputElement;
  const pick = field('pick') as HTMLSelectElement;
  const event = form.querySelector<HTMLFieldSetElement>('[data-post-event]')!;
  const status = form.querySelector('[data-post-status]')!;
  // The site's root: the editor is at <root>/editor/, so links to posts work under the GitHub Pages sub-path too.
  const root = location.pathname.replace(/editor\/?$/, '');

  const showEvent = () => { event.hidden = field('type').value !== 'event'; };

  function fill(source?: Source) {
    for (const name of TEXT_FIELDS) field(name).value = source?.fields[name] ?? '';
    field('body').value = source?.body ?? '';
    box('allDay').checked = source?.fields.allDay === 'true';
    box('draft').checked = source?.fields.draft === 'true';
    if (!source) {
      field('date').value = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
      field('type').value = 'news';
    }
    showEvent();
    status.textContent = source ? `You are editing "${source.fields.title}".` : '';
  }

  pick.addEventListener('change', () => fill(posts.find((p) => p.slug === pick.value)));
  field('type').addEventListener('change', showEvent);
  field('editor').value = readText(NAME_KEY); // the name that the comment form also uses
  fill();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const source = posts.find((p) => p.slug === pick.value);
    const payload: Record<string, string> = { form: 'post', action: source ? 'edit' : 'new', slug: source?.slug ?? '', baseSha: source?.sha ?? '' };
    for (const name of TEXT_FIELDS) payload[name] = field(name).value.trim();
    payload.allDay = box('allDay').checked ? 'true' : '';
    payload.draft = box('draft').checked ? 'true' : '';
    payload.body = field('body').value;
    payload.editor = field('editor').value.trim();
    payload.note = field('note').value.trim();
    payload.website = field('website').value;
    write(NAME_KEY, payload.editor);
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    button.disabled = true;
    status.textContent = 'Sending…';
    try {
      const res = await fetch(store, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `The store answered ${res.status}`);
      write(SENT_KEY, [{ id: data.id, title: payload.title, time: new Date().toISOString() }, ...read<Sent[]>(SENT_KEY, [])].slice(0, 30));
      status.textContent = 'Sent. The post waits in the shared sheet until a team member approves it.';
      await showSent();
    } catch (err) {
      // An older store (comments.gs without posts.gs) treats a post as a comment and asks for a page path.
      const message = (err as Error).message.replace(/\.+$/, '');
      const reason = /page path is required/i.test(message)
        ? 'The store runs an older version of its script, without the post editor. A team member must add posts.gs and deploy a new version (README, "Set up the post editor")'
        : message;
      status.textContent = `The post was not sent. ${reason}. Your text is still in the form.`;
    } finally {
      button.disabled = false;
    }
  });

  async function showSent() {
    const list = form!.querySelector<HTMLOListElement>('[data-post-sent]')!;
    const sent = read<Sent[]>(SENT_KEY, []);
    list.replaceChildren();
    if (!sent.length) {
      const li = document.createElement('li');
      li.textContent = 'None yet.';
      list.append(li);
      return;
    }
    for (const s of sent) {
      const li = document.createElement('li');
      const title = document.createElement('strong');
      title.textContent = s.title;
      const state = document.createElement('span');
      state.textContent = ' · checking…';
      li.append(title, state);
      list.append(li);
      try {
        const data = await (await fetch(`${store}?post=${encodeURIComponent(s.id)}`, { cache: 'no-store' })).json();
        if (!data.ok) throw new Error(data.error);
        state.textContent = ` · ${STATUS[data.status] ?? data.status}`;
        if (data.status === 'published' && data.slug) {
          const a = document.createElement('a');
          a.href = `${root}news/${data.slug}/`;
          a.textContent = 'Open the post';
          li.append(' · ', a, ' (the site needs about 2 minutes to update)');
        } else if (data.status === 'error' && data.result) {
          li.append(`: ${data.result}`);
        }
      } catch (err) {
        state.textContent = ` · status unknown: ${(err as Error).message}`;
      }
    }
  }

  form.querySelector('[data-post-refresh]')!.addEventListener('click', () => { showSent(); });
  showSent();
}
