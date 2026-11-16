import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../docs/feedback/comments.gs', import.meta.url), 'utf8');

function createStore() {
  const rows = [];
  let tabExists = false;
  let held = false;
  let uuid = 0;
  const tab = {
    getLastRow: () => rows.length,
    setFrozenRows: () => {},
    getRange(start, column, count, width) {
      return {
        setNumberFormat() { return this; },
        setValues(values) {
          values.forEach((row, i) => { rows[start - 1 + i] = [...row]; });
          return this;
        },
        getValues: () => rows.slice(start - 1, start - 1 + count).map((row) => row.slice(column - 1, column - 1 + width)),
        getDisplayValues: () => rows.slice(start - 1, start - 1 + count)
          .map((row) => row.slice(column - 1, column - 1 + width).map((value) => value.startsWith("'") ? value.slice(1) : value)),
      };
    },
  };
  const context = {
    console: { error() {} },
    ContentService: {
      MimeType: { JSON: 'json' },
      createTextOutput: (text) => ({ setMimeType: () => text }),
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'sheet-id' }) },
    SpreadsheetApp: {
      openById: () => ({
        getSheetByName: () => tabExists ? tab : null,
        insertSheet: () => { tabExists = true; return tab; },
      }),
      flush() {},
    },
    LockService: { getScriptLock: () => ({
      tryLock: () => { if (held) return false; held = true; return true; },
      hasLock: () => held,
      releaseLock: () => { held = false; },
    }) },
    Utilities: { getUuid: () => `id-${++uuid}` },
  };
  runInNewContext(source, context);
  return {
    rows,
    get: (page) => JSON.parse(context.doGet({ parameter: { page } })),
    post: (value) => JSON.parse(context.doPost({ postData: { contents: JSON.stringify(value) } })),
  };
}

const comment = (overrides = {}) => ({
  page: '/about/', title: 'About', kind: 'element', target: 'Paragraph: About',
  heading: '', selector: '#about', snippet: 'About', quote: '', comment: 'A comment',
  name: '', website: '', ...overrides,
});

test('stores page, menu and question comments and filters hidden rows', () => {
  const store = createStore();
  const page = store.post(comment());
  const menu = store.post(comment({ page: '/other/', kind: 'menu' }));
  const question = store.post(comment({ page: '/review/', kind: 'question' }));
  assert.equal(page.ok, true);
  assert.equal(menu.ok, true);
  assert.equal(question.ok, true);
  assert.deepEqual(store.get('/about/').comments.map((c) => c.id), [page.id, menu.id]);
  assert.deepEqual(store.get('/review/').comments.map((c) => c.id), [menu.id, question.id]);
  store.rows[2][12] = 'hidden';
  assert.deepEqual(store.get('/about/').comments.map((c) => c.id), [page.id]);
});

test('rejects invalid input and honeypot submissions without adding rows', () => {
  const store = createStore();
  for (const overrides of [
    { comment: '   ' }, { comment: 'x'.repeat(4001) }, { page: 'https://example.com/' },
    { kind: 'unknown' }, { website: 'spam' }, { name: 7 }, { target: '' },
  ]) {
    assert.equal(store.post(comment(overrides)).ok, false);
  }
  assert.equal(store.get('not-a-path').ok, false);
  assert.equal(store.rows.length, 0);
});

test('writes formula-like user text as literal sheet values', () => {
  const store = createStore();
  const result = store.post(comment({ comment: '=1+1', name: '@name' }));
  assert.equal(result.ok, true);
  assert.equal(store.rows[1][10], "'=1+1");
  assert.equal(store.rows[1][11], "'@name");
  assert.equal(store.get('/about/').comments[0].comment, '=1+1');
});

test('does not write to a sheet with changed column headers', () => {
  const store = createStore();
  store.post(comment());
  store.rows[0][0] = 'changed';
  assert.equal(store.post(comment()).ok, false);
  assert.equal(store.rows.length, 2);
});
