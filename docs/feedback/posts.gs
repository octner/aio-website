// Google Apps Script for the test site's post editor (/editor/). Add it to the same Apps Script project
// as comments.gs: the doGet and doPost of comments.gs pass post requests to this file.
//
// Two separate paths:
// 1. Anyone with the editor address submits a new or edited post. submitPost() only adds a row to the
//    "Posts" tab, with status "submitted". It never calls GitHub.
// 2. A team member who can edit the sheet sets a row's status to "approve". Only then does publishRow()
//    write the file src/content/posts/<slug>.md to GitHub, with the token in the script properties.
//    The GitHub workflow then rebuilds and publishes the site.
//
// Script properties: SPREADSHEET_ID (as for comments), GITHUB_TOKEN (a fine-grained token with
// "Contents: read and write" on this one repository and no other permission), GITHUB_REPO ("owner/name"),
// and optionally GITHUB_BRANCH (default "main"). Run setUp() once from the script editor.

const POSTS_SHEET = 'Posts';
const POST_COLUMNS = ['id', 'time', 'action', 'slug', 'baseSha', 'title', 'date', 'type', 'summary', 'author', 'image', 'imageAlt',
  'eventStart', 'eventEnd', 'allDay', 'location', 'registration', 'draft', 'body', 'editor', 'note', 'status', 'result'];
// The front matter fields that the editor sets. Every other field of an existing post (status, legacy,
// originalSource, ...) is copied unchanged from the file on GitHub.
const FORM_FIELDS = ['title', 'date', 'type', 'summary', 'author', 'image', 'imageAlt', 'eventStart', 'eventEnd', 'allDay', 'location', 'registration', 'draft'];
const POST_LIMITS = { title: 200, summary: 400, author: 100, image: 500, imageAlt: 300, location: 200, registration: 500,
  body: 40000, editor: 100, note: 1000 };
const POST_TYPES = ['news', 'event', 'case-study'];
const POSTS_DIR = 'src/content/posts/';

// ---------- the sheet ----------

function postsSheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('The SPREADSHEET_ID script property is not set.');
  const book = SpreadsheetApp.openById(id);
  let tab = book.getSheetByName(POSTS_SHEET);
  if (!tab) tab = book.insertSheet(POSTS_SHEET);
  if (tab.getLastRow() === 0) {
    tab.getRange(1, 1, 1, POST_COLUMNS.length).setValues([POST_COLUMNS]);
    tab.setFrozenRows(1);
  } else {
    const header = tab.getRange(1, 1, 1, POST_COLUMNS.length).getValues()[0];
    if (header.some((value, i) => value !== POST_COLUMNS[i])) throw new Error('The Posts sheet has unexpected column headers.');
  }
  return tab;
}

// A leading apostrophe keeps text such as "- item" or "=1+1" from being read as a formula.
function toCell(value) {
  const text = String(value == null ? '' : value);
  return /^\s*[=+\-@]/.test(text) ? "'" + text : text;
}
function fromCell(value) {
  const text = String(value == null ? '' : value);
  return /^'\s*[=+\-@]/.test(text) ? text.slice(1) : text;
}

function readPostRow(tab, row) {
  const values = tab.getRange(row, 1, 1, POST_COLUMNS.length).getValues()[0];
  const item = {};
  POST_COLUMNS.forEach((key, i) => { item[key] = fromCell(values[i]); });
  return item;
}

function setPostCells(tab, row, changes) {
  Object.keys(changes).forEach((key) => {
    tab.getRange(row, POST_COLUMNS.indexOf(key) + 1, 1, 1).setNumberFormat('@').setValues([[toCell(changes[key])]]);
  });
}

// ---------- checks that mirror the site's schema (src/content.config.ts) ----------

function realDate(text) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}
function realDateTime(text) {
  if (realDate(text)) return true;
  const m = /^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?(Z|[+-](0\d|1[0-4]):[0-5]\d)?$/.exec(text);
  return !!m && realDate(m[1]) && !isNaN(Date.parse(m[5] ? text : text + 'Z'));
}

// The only raw HTML that a post may contain is the video block of EDITING.md. Every other tag is refused,
// because the site publishes raw HTML in Markdown as it is.
const VIDEO_BLOCK = /<div class="video" data-youtube="[\w-]{11}"><a href="https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}"><img src="https:\/\/i\.ytimg\.com\/vi\/[\w-]{11}\/hqdefault\.jpg" alt="" loading="lazy" width="480" height="360"><span class="play">[^<>]*<\/span><\/a><\/div>/g;
// Every link target must start with one of these. The Markdown renderer publishes any other target,
// for example "javascript:", also when it is written with an HTML entity or as a reference link.
const LINK_TARGET = /^(https?:\/\/|mailto:|\/|#)/i;
function bodyProblem(body) {
  const autolink = /<([A-Za-z][A-Za-z0-9+.-]*:[^<>\s]*)>/g;
  const targets = []
    .concat([...body.matchAll(/\]\(\s*<?([^)\s>]*)/g)].map((m) => m[1]))                          // [text](target), ![alt](target)
    .concat([...body.matchAll(/^ {0,3}\[[^\]]+\]:\s*<?(\S*?)>?(?:\s|$)/gm)].map((m) => m[1]))     // [label]: target
    .concat([...body.matchAll(autolink)].map((m) => m[1]));                                     // <target>
  if (targets.some((t) => !LINK_TARGET.test(t))) return 'The text contains a link that is not allowed. Links must start with https://, http://, mailto:, / or #.';
  const rest = body.replace(VIDEO_BLOCK, '').replace(autolink, '');
  if (/<[A-Za-z\/!?]/.test(rest)) return 'The text contains HTML. Only the video block of the editing guide is allowed.';
  return '';
}

function checkPost(input) {
  const s = (key) => (typeof input[key] === 'string' ? input[key] : input[key] == null ? '' : null);
  for (const key of FORM_FIELDS.concat(['body', 'editor', 'note', 'slug', 'baseSha', 'action'])) {
    if (s(key) === null) throw new RequestError(`Invalid ${key}.`);
    if (POST_LIMITS[key] && s(key).length > POST_LIMITS[key]) throw new RequestError(`The ${key} is too long (at most ${POST_LIMITS[key]} characters).`);
  }
  const action = s('action');
  if (action !== 'new' && action !== 'edit') throw new RequestError('Invalid action.');
  if (action === 'edit' && !/^[a-z0-9][a-z0-9-]{0,99}$/.test(s('slug'))) throw new RequestError('Invalid post to edit.');
  if (action === 'edit' && !/^[0-9a-f]{40}$/.test(s('baseSha'))) throw new RequestError('Invalid version of the post.');
  if (!s('title').trim()) throw new RequestError('A title is required.');
  if (!realDate(s('date'))) throw new RequestError('The date must be a real date written as YYYY-MM-DD.');
  if (!POST_TYPES.includes(s('type'))) throw new RequestError('Invalid type.');
  if (s('image') && !/^(https:\/\/[^\s"'<>]+|\/uploads\/[\w.\/-]+)$/.test(s('image'))) throw new RequestError('The image must be an https:// address or a file in /uploads/.');
  if (s('registration') && !/^https:\/\/[^\s"'<>]+$/.test(s('registration'))) throw new RequestError('The registration link must be an https:// address.');
  for (const key of ['eventStart', 'eventEnd']) {
    if (s(key) && !realDateTime(s(key))) throw new RequestError(`The ${key === 'eventStart' ? 'start' : 'end'} must be a real date, for example 2026-12-03 or 2026-12-03T13:00:00+11:00.`);
  }
  if (s('eventEnd') && !s('eventStart')) throw new RequestError('An event with an end also needs a start.');
  if (s('eventStart') && s('eventEnd') && Date.parse(s('eventEnd')) < Date.parse(s('eventStart'))) throw new RequestError('The event ends before it starts.');
  for (const key of ['allDay', 'draft']) if (!['', 'true', 'false'].includes(s(key))) throw new RequestError(`Invalid ${key}.`);
  if (!s('body').trim()) throw new RequestError('The text of the post is empty.');
  const problem = bodyProblem(s('body'));
  if (problem) throw new RequestError(problem);
}

// ---------- path 1: submissions (anyone) ----------

function submitPost(input) {
  let lock;
  try {
    if (input.website) throw new RequestError('The post could not be accepted.');
    checkPost(input);
    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) throw new RequestError('The store is busy. Please try again.');
    const tab = postsSheet();
    const id = Utilities.getUuid();
    // status and result come only from this script, never from the input
    const item = {};
    POST_COLUMNS.forEach((key) => { item[key] = typeof input[key] === 'string' ? input[key] : ''; });
    if (item.action === 'new') { item.slug = ''; item.baseSha = ''; }
    if (item.type !== 'event') { item.eventStart = ''; item.eventEnd = ''; item.allDay = ''; item.location = ''; item.registration = ''; }
    Object.assign(item, { id, time: new Date().toISOString(), status: 'submitted', result: '' });
    tab.getRange(tab.getLastRow() + 1, 1, 1, POST_COLUMNS.length).setNumberFormat('@').setValues([POST_COLUMNS.map((key) => toCell(item[key]))]);
    SpreadsheetApp.flush();
    return respond({ ok: true, id });
  } catch (error) {
    return errorResponse(error);
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

/** The status of one submission. The list of submissions is not public, because it is not approved. */
function postStatus(id) {
  try {
    if (!/^[0-9a-f-]{36}$/.test(id)) throw new RequestError('Invalid submission id.');
    const tab = postsSheet();
    const count = tab.getLastRow() - 1;
    const ids = count > 0 ? tab.getRange(2, 1, count, 1).getValues().map((r) => String(r[0])) : [];
    const index = ids.indexOf(id);
    if (index < 0) throw new RequestError('The submission was not found.');
    const item = readPostRow(tab, index + 2);
    return respond({ ok: true, status: item.status.trim().toLowerCase(), result: item.result, slug: item.slug });
  } catch (error) {
    return errorResponse(error);
  }
}

// ---------- the Markdown file ----------

/** Splits a post file into its front matter blocks (one per top-level field) and its body. */
function splitPostFile(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) throw new Error('The file on GitHub has no front matter.');
  const blocks = [];
  m[1].split(/\r?\n/).forEach((line) => {
    const key = /^([A-Za-z][\w]*):/.exec(line);
    if (key) blocks.push({ key: key[1], text: line });
    else if (blocks.length) blocks[blocks.length - 1].text += '\n' + line;
  });
  return { blocks, body: m[2] };
}

const quote = (value) => JSON.stringify(value); // a JSON string is a valid YAML string

/** The file text for a row. Fields that the editor does not set are copied from the current file. */
function composePostFile(item, currentText) {
  const lines = [];
  const add = (key, value) => { if (value !== '') lines.push(`${key}: ${value}`); };
  add('title', quote(item.title.trim()));
  add('date', item.date);
  add('type', item.type);
  if (item.summary.trim()) add('summary', quote(item.summary.trim()));
  if (item.author.trim()) add('author', quote(item.author.trim()));
  if (item.image) add('image', quote(item.image));
  if (item.image && item.imageAlt.trim()) add('imageAlt', quote(item.imageAlt.trim()));
  add('eventStart', item.eventStart);
  add('eventEnd', item.eventEnd);
  if (item.allDay === 'true') add('allDay', 'true');
  if (item.location.trim()) add('location', quote(item.location.trim()));
  if (item.registration) add('registration', quote(item.registration));
  if (item.draft === 'true') add('draft', 'true');
  const kept = currentText ? splitPostFile(currentText).blocks.filter((b) => !FORM_FIELDS.includes(b.key)).map((b) => b.text) : ['status: new'];
  const body = item.body.replace(/\r\n/g, '\n').replace(/\s*$/, '\n');
  return `---\n${lines.concat(kept).join('\n')}\n---\n\n${body}`;
}

function slugFrom(title) {
  return title.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '') || 'post';
}

// ---------- path 2: publication after approval (team members who can edit the sheet) ----------

function github(method, path, body) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('GITHUB_TOKEN');
  const repo = props.getProperty('GITHUB_REPO');
  if (!token || !repo) throw new Error('The GITHUB_TOKEN or GITHUB_REPO script property is not set.');
  const res = UrlFetchApp.fetch(`https://api.github.com/repos/${repo}${path}`, {
    method,
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    payload: body ? JSON.stringify(body) : undefined,
    muteHttpExceptions: true,
  });
  const text = res.getContentText();
  let json = {};
  try { json = text ? JSON.parse(text) : {}; } catch (error) { json = {}; }
  return { code: res.getResponseCode(), json };
}

function branch() {
  return PropertiesService.getScriptProperties().getProperty('GITHUB_BRANCH') || 'main';
}

function readGithubFile(slug) {
  const res = github('get', `/contents/${POSTS_DIR}${slug}.md?ref=${encodeURIComponent(branch())}`);
  if (res.code === 404) return null;
  if (res.code !== 200) throw new Error(`GitHub answered ${res.code} when the script read ${slug}.md: ${res.json.message || 'no message'}`);
  const bytes = Utilities.base64Decode(String(res.json.content || '').replace(/\s/g, ''));
  return { sha: res.json.sha, text: Utilities.newBlob(bytes).getDataAsString('UTF-8') };
}

function publishRow(tab, row) {
  const item = readPostRow(tab, row);
  if (item.status.trim().toLowerCase() !== 'approve') return;
  setPostCells(tab, row, { status: 'publishing', result: '' });
  try {
    checkPost(item); // the row may have been changed in the sheet after it was submitted
    let slug = item.slug;
    let current = null;
    if (item.action === 'edit') {
      current = readGithubFile(slug);
      if (!current) throw new Error(`The post ${slug}.md is no longer on GitHub.`);
      if (current.sha !== item.baseSha) {
        setPostCells(tab, row, { status: 'conflict', result: `The post changed on GitHub after the editor loaded it. Open the editor again and redo the change.` });
        return;
      }
    } else {
      const base = slugFrom(item.title);
      for (let n = 1; ; n++) {
        slug = n === 1 ? base : `${base}-${n}`;
        if (!readGithubFile(slug)) break;
        if (n === 20) throw new Error('Twenty posts already use this title. Change the title.');
      }
    }
    const text = composePostFile(item, current && current.text);
    const res = github('put', `/contents/${POSTS_DIR}${slug}.md`, {
      message: `${item.action === 'new' ? 'Add' : 'Edit'} post "${item.title.trim()}" (website editor, approved in the sheet)`,
      content: Utilities.base64Encode(text, Utilities.Charset.UTF_8),
      branch: branch(),
      sha: current ? current.sha : undefined,
    });
    if (res.code !== 200 && res.code !== 201) throw new Error(`GitHub answered ${res.code}: ${res.json.message || 'no message'}`);
    setPostCells(tab, row, { status: 'published', slug, result: (res.json.commit && res.json.commit.html_url) || 'published' });
  } catch (error) {
    console.error(error);
    setPostCells(tab, row, { status: 'error', result: String(error && error.message ? error.message : error) });
  }
}

/** Installable trigger: runs when a team member edits the Posts tab. */
function onPostsEdit(e) {
  if (!e || !e.range || e.range.getSheet().getName() !== POSTS_SHEET) return;
  publishApproved();
}

/** Publishes every row with the status "approve". Also on the sheet menu "AIO website". */
function publishApproved() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;
  try {
    const tab = postsSheet();
    const count = tab.getLastRow() - 1;
    if (count < 1) return;
    const statusColumn = POST_COLUMNS.indexOf('status') + 1;
    const statuses = tab.getRange(2, statusColumn, count, 1).getValues();
    statuses.forEach((value, i) => { if (String(value[0]).trim().toLowerCase() === 'approve') publishRow(tab, i + 2); });
  } finally {
    lock.releaseLock();
  }
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('AIO website').addItem('Publish approved posts', 'publishApproved').addToUi();
}

/** Run once from the script editor. Safe to run again. */
function setUp() {
  postsSheet();
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  const exists = ScriptApp.getProjectTriggers().some((t) => t.getHandlerFunction() === 'onPostsEdit');
  if (!exists) ScriptApp.newTrigger('onPostsEdit').forSpreadsheet(id).onEdit().create();
  const res = github('get', '');
  if (res.code !== 200) throw new Error(`The token cannot read the repository: GitHub answered ${res.code}.`);
  console.log(`Ready: the Posts tab exists, the edit trigger is ${exists ? 'already there' : 'created'}, and the token can read ${res.json.full_name}.`);
}
