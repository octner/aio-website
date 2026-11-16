// Tests the post editor's store (docs/feedback/posts.gs) with mocked Google and GitHub services,
// and checks that every existing post survives a save through the editor unchanged.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { readPostSource, gitBlobSha, FORM_FIELDS } from '../src/lib/post-source.mjs';

const source = ['comments.gs', 'posts.gs']
  .map((f) => readFileSync(new URL(`../docs/feedback/${f}`, import.meta.url), 'utf8')).join('\n');
const POSTS = new URL('../src/content/posts/', import.meta.url);

function createStore(files = {}) {
  const tabs = new Map();
  const makeTab = (name) => {
    const rows = [];
    return {
      rows,
      getName: () => name,
      getLastRow: () => rows.length,
      setFrozenRows() {},
      getRange(start, column, count = 1, width = 1) {
        return {
          setNumberFormat() { return this; },
          setValues(values) {
            values.forEach((v, i) => {
              const row = rows[start - 1 + i] ?? (rows[start - 1 + i] = []);
              v.forEach((cell, j) => { row[column - 1 + j] = cell; });
            });
            return this;
          },
          getValues: () => rows.slice(start - 1, start - 1 + count).map((row) => Array.from({ length: width }, (_, j) => row[column - 1 + j] ?? '')),
          getDisplayValues() { return this.getValues(); },
        };
      },
    };
  };
  const repo = new Map(Object.entries(files).map(([path, text]) => [path, { text, sha: gitBlobSha(Buffer.from(text)) }]));
  const calls = [];
  let held = false;
  let uuid = 0;
  const context = {
    console: { error() {}, log() {} },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (text) => ({ setMimeType: () => text }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => ({ SPREADSHEET_ID: 'sheet', GITHUB_TOKEN: 'secret-token', GITHUB_REPO: 'me/aio-website' })[k] ?? null }) },
    SpreadsheetApp: {
      openById: () => ({
        getSheetByName: (n) => tabs.get(n) ?? null,
        insertSheet: (n) => { const t = makeTab(n); tabs.set(n, t); return t; },
      }),
      flush() {},
    },
    LockService: { getScriptLock: () => ({
      tryLock: () => { if (held) return false; held = true; return true; },
      hasLock: () => held,
      releaseLock: () => { held = false; },
    }) },
    Utilities: {
      getUuid: () => `00000000-0000-4000-8000-${String(++uuid).padStart(12, '0')}`,
      Charset: { UTF_8: 'utf8' },
      base64Encode: (text) => Buffer.from(text, 'utf8').toString('base64'),
      base64Decode: (b64) => [...Buffer.from(b64, 'base64')],
      newBlob: (bytes) => ({ getDataAsString: () => Buffer.from(bytes).toString('utf8') }),
    },
    UrlFetchApp: {
      fetch(url, opts) {
        calls.push({ url, opts });
        const path = decodeURIComponent(url.replace('https://api.github.com/repos/me/aio-website', '').replace(/\?.*$/, '').replace(/^\/contents\//, ''));
        const answer = (code, json) => ({ getResponseCode: () => code, getContentText: () => JSON.stringify(json) });
        if (path === '') return answer(200, { full_name: 'me/aio-website' });
        const file = repo.get(path);
        if (opts.method === 'get') return file ? answer(200, { sha: file.sha, content: Buffer.from(file.text).toString('base64').replace(/(.{60})/g, '$1\n') }) : answer(404, { message: 'Not Found' });
        const body = JSON.parse(opts.payload);
        if (file && body.sha !== file.sha) return answer(409, { message: 'sha does not match' });
        const text = Buffer.from(body.content, 'base64').toString('utf8');
        repo.set(path, { text, sha: gitBlobSha(Buffer.from(text)) });
        return answer(file ? 200 : 201, { commit: { html_url: `https://github.com/me/aio-website/commit/${calls.length}` } });
      },
    },
  };
  runInNewContext(`${source}\nthis.POST_COLUMNS = POST_COLUMNS;`, context);
  const posts = () => tabs.get('Posts');
  const col = (name) => context.POST_COLUMNS.indexOf(name);
  return {
    context, repo, calls,
    submit: (value) => JSON.parse(context.doPost({ postData: { contents: JSON.stringify({ form: 'post', ...value }) } })),
    status: (id) => JSON.parse(context.doGet({ parameter: { post: id } })),
    approve(row) { posts().rows[row][col('status')] = 'approve'; context.publishApproved(); },
    cell: (row, name) => posts().rows[row][col(name)],
  };
}

const post = (overrides = {}) => ({
  action: 'new', slug: '', baseSha: '', title: 'A new study', date: '2026-11-20', type: 'news', summary: 'Short summary.',
  author: 'Editor', image: '', imageAlt: '', eventStart: '', eventEnd: '', allDay: '', location: '', registration: '',
  draft: '', body: 'First paragraph.\n\n- a list item\n', editor: 'Sam', note: '', website: '', ...overrides,
});

test('a submission only adds a row: it never calls GitHub and cannot set its own status', () => {
  const store = createStore();
  const res = store.submit(post({ status: 'approve', result: 'x' }));
  assert.equal(res.ok, true);
  assert.equal(store.cell(1, 'status'), 'submitted');
  assert.equal(store.cell(1, 'result'), '');
  assert.equal(store.calls.length, 0);
  assert.deepEqual(store.status(res.id), { ok: true, status: 'submitted', result: '', slug: '' });
});

test('refuses unsafe or invalid posts', () => {
  const store = createStore();
  for (const bad of [
    { body: 'Hi <script>alert(1)</script>' }, { body: '<img src=x onerror=alert(1)>' }, { body: '[click](javascript:alert(1))' },
    { body: '<iframe src="https://example.org"></iframe>' }, { date: '2026-02-30' }, { date: '20/11/2026' }, { type: 'blog' },
    { image: 'javascript:alert(1)' }, { image: 'http://example.org/a.jpg' }, { registration: 'http://example.org' },
    { title: '   ' }, { body: '  ' }, { body: 'x'.repeat(40001) }, { website: 'spam' },
    { type: 'event', eventStart: '2026-12-03T25:00' }, { type: 'event', eventEnd: '2026-12-03' },
    { type: 'event', eventStart: '2026-12-04', eventEnd: '2026-12-03' },
    { action: 'edit', slug: '../../.github/workflows/deploy', baseSha: 'a'.repeat(40) }, { action: 'edit', slug: 'post', baseSha: 'nope' },
  ]) {
    assert.equal(store.submit(post(bad)).ok, false, JSON.stringify(bad));
  }
  assert.equal(store.context.SpreadsheetApp.openById().getSheetByName('Posts')?.rows.length ?? 1, 1);
});

test('accepts the video block of the editing guide and autolinks', () => {
  const store = createStore();
  const video = '<div class="video" data-youtube="EEzlKi5nT8k"><a href="https://www.youtube.com/watch?v=EEzlKi5nT8k"><img src="https://i.ytimg.com/vi/EEzlKi5nT8k/hqdefault.jpg" alt="" loading="lazy" width="480" height="360"><span class="play">Play video: A talk</span></a></div>';
  assert.equal(store.submit(post({ body: `Intro <https://example.org>.\n\n${video}\n` })).ok, true);
});

test('an approved new post is written to GitHub once, with a free file name', () => {
  const store = createStore({ 'src/content/posts/a-new-study.md': '---\ntitle: Old\ndate: 2026-01-01\ntype: news\n---\n\nOld\n' });
  store.submit(post());
  store.approve(1);
  assert.equal(store.cell(1, 'status'), 'published');
  assert.equal(store.cell(1, 'slug'), 'a-new-study-2');
  assert.match(store.cell(1, 'result'), /^https:\/\/github\.com\//);
  const file = store.repo.get('src/content/posts/a-new-study-2.md').text;
  assert.match(file, /^---\ntitle: "A new study"\ndate: 2026-11-20\ntype: news\n/);
  assert.match(file, /\nstatus: new\n---\n\nFirst paragraph\.\n\n- a list item\n$/);
  const puts = store.calls.filter((c) => c.opts.method === 'put').length;
  store.context.publishApproved(); // a second run does nothing: the row is no longer "approve"
  assert.equal(store.calls.filter((c) => c.opts.method === 'put').length, puts);
  assert.ok(!JSON.stringify(store.status(store.cell(1, 'id'))).includes('secret-token'));
});

test('an edit keeps the other fields of the file, and a stale edit is refused', () => {
  const original = '---\ntitle: "Old title"\ndate: 2026-03-01\ntype: news\nsummary: "Old"\nauthor: "A"\nstatus: migrated\nlegacy:\n  - /old-address/\noriginalUrl: "https://example.org/a"\n---\n\nOld text.\n';
  const store = createStore({ 'src/content/posts/old.md': original });
  const sha = gitBlobSha(Buffer.from(original));
  store.submit(post({ action: 'edit', slug: 'old', baseSha: sha, title: 'New title', body: 'New text.\n' }));
  store.approve(1);
  assert.equal(store.cell(1, 'status'), 'published');
  const file = store.repo.get('src/content/posts/old.md').text;
  assert.match(file, /title: "New title"/);
  assert.match(file, /\nstatus: migrated\nlegacy:\n {2}- \/old-address\/\noriginalUrl: "https:\/\/example\.org\/a"\n---\n\nNew text\.\n$/);
  // a second edit based on the original version is now stale
  store.submit(post({ action: 'edit', slug: 'old', baseSha: sha, title: 'Other title' }));
  store.approve(2);
  assert.equal(store.cell(2, 'status'), 'conflict');
  assert.match(store.repo.get('src/content/posts/old.md').text, /New title/);
});

test('every editable post survives a save unchanged, and other posts are marked not editable', () => {
  const store = createStore();
  const { composePostFile, splitPostFile } = store.context;
  const files = readdirSync(POSTS).filter((f) => f.endsWith('.md')).map((f) => [f, readFileSync(new URL(f, POSTS), 'utf8')]);
  // forms that the editor must leave alone, and one that it must accept
  files.push(
    ['two-lines.md', '---\ntitle: A\ndate: 2026-11-20\ntype: news\nsummary: First line\n  second line\n---\n\nText.\n'],
    ['time.md', '---\ntitle: A\ndate: 2026-11-20T10:00:00+11:00\ntype: news\n---\n\nText.\n'],
    ['template.md', readFileSync(new URL('../docs/templates/news-post.md', import.meta.url), 'utf8')],
  );
  for (const [name, text] of files) {
    const { fields, body, editable, reason } = readPostSource(text);
    if (name === 'two-lines.md' || name === 'time.md') { assert.equal(editable, false, name); continue; }
    if (!editable) { assert.ok(reason, name); continue; }
    const saved = composePostFile({ ...fields, body }, text);
    const again = readPostSource(saved);
    assert.ok(again.editable, `${name}: ${again.reason}`);
    for (const key of FORM_FIELDS) {
      const expected = key === 'imageAlt' && !fields.image ? '' : fields[key].trim();
      assert.equal(again.fields[key], expected, `${name}: ${key}`);
    }
    assert.equal(again.body.trimEnd(), body.trimEnd(), `${name}: body`);
    const others = (t) => splitPostFile(t).blocks.filter((b) => !FORM_FIELDS.includes(b.key)).map((b) => b.text);
    assert.deepEqual(others(saved), others(text), `${name}: other fields`);
  }
});

test('refuses every form of a link that is not https, http, mailto, / or #', () => {
  const store = createStore();
  for (const body of ['[a](&#106;avascript:alert(1))', '[b][1]\n\n[1]: javascript:alert(4)', '[c](javascript:alert(2))',
    '<javascript:alert(3)>', '![x](data:image/svg+xml,abc)', '[d]( vbscript:x)', '[e](<javascript:x>)']) {
    assert.equal(store.submit(post({ body })).ok, false, body);
  }
  for (const body of ['[a](https://example.org)', '[b](/about/)', '[c](#top)', '[d](mailto:a@b.org)', '[e][1]\n\n[1]: https://example.org']) {
    assert.equal(store.submit(post({ body })).ok, true, body);
  }
});
