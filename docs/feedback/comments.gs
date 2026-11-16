// Google Apps Script web app for the test site's shared comments.
// Set the SPREADSHEET_ID script property before deploying.
// The post editor (posts.gs, in the same project) shares this web app: doGet and doPost pass its requests on.
const SHEET_NAME = 'Comments';
const COLUMNS = ['id', 'time', 'page', 'title', 'kind', 'target', 'heading', 'selector', 'snippet', 'quote', 'comment', 'name', 'status'];
const LIMITS = { page: 500, title: 300, kind: 20, target: 500, heading: 300, selector: 2000, snippet: 120, quote: 600, comment: 4000, name: 100, website: 500 };
const KINDS = ['element', 'page', 'menu', 'question'];

class RequestError extends Error {}

function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function sheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('The SPREADSHEET_ID script property is not set.');
  const book = SpreadsheetApp.openById(id);
  let tab = book.getSheetByName(SHEET_NAME);
  if (!tab) tab = book.insertSheet(SHEET_NAME);
  if (tab.getLastRow() === 0) {
    tab.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
    tab.setFrozenRows(1);
  } else {
    const header = tab.getRange(1, 1, 1, COLUMNS.length).getValues()[0];
    if (header.some((value, i) => value !== COLUMNS[i])) {
      throw new Error('The Comments sheet has unexpected column headers.');
    }
  }
  return tab;
}

function errorResponse(error) {
  console.error(error);
  return respond({ ok: false, error: error instanceof RequestError ? error.message : 'The comment store failed. Check the Apps Script execution log.' });
}

function validPage(page) {
  return typeof page === 'string' && page.length <= LIMITS.page && /^\/[^?#]*$/.test(page);
}

// Reads take no lock: a row is written in one call under the lock of doPost, so a read sees it whole or not at all.
function doGet(e) {
  if (e && e.parameter && e.parameter.post) return postStatus(e.parameter.post);
  try {
    const page = e && e.parameter && e.parameter.page;
    if (!validPage(page)) throw new RequestError('A valid page path is required.');
    const tab = sheet();
    const count = tab.getLastRow() - 1;
    const rows = count > 0 ? tab.getRange(2, 1, count, COLUMNS.length).getDisplayValues() : [];
    const comments = rows.map((row) => {
      const item = {};
      COLUMNS.forEach((key, i) => { item[key] = row[i]; });
      return item;
    }).filter((item) => item.status.trim().toLowerCase() !== 'hidden' && (item.page === page || item.kind === 'menu'));
    return respond({ ok: true, comments });
  } catch (error) {
    return errorResponse(error);
  }
}

function doPost(e) {
  let lock;
  try {
    if (!e || !e.postData || typeof e.postData.contents !== 'string') throw new RequestError('A JSON comment is required.');
    let input;
    try { input = JSON.parse(e.postData.contents); }
    catch (error) { throw new RequestError('The comment is not valid JSON.'); }
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new RequestError('A JSON comment is required.');
    if (input.form === 'post') return submitPost(input);
    for (const key of Object.keys(LIMITS)) {
      if (input[key] !== undefined && (typeof input[key] !== 'string' || input[key].length > LIMITS[key])) {
        throw new RequestError(`Invalid ${key}.`);
      }
    }
    if (input.website) throw new RequestError('The comment could not be accepted.');
    if (!validPage(input.page)) throw new RequestError('A valid page path is required.');
    if (!KINDS.includes(input.kind)) throw new RequestError('Invalid comment kind.');
    if (typeof input.comment !== 'string' || !input.comment.trim()) throw new RequestError('A comment is required.');
    if (typeof input.target !== 'string' || !input.target.trim()) throw new RequestError('A comment target is required.');

    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) throw new RequestError('The comment store is busy. Please try again.');
    const tab = sheet();
    const id = Utilities.getUuid();
    const item = { ...input, id, time: new Date().toISOString(), status: 'open' };
    // A leading apostrophe makes user-supplied formula-like text literal in Sheets.
    const row = COLUMNS.map((key) => {
      const value = item[key] || '';
      return /^\s*[=+\-@]/.test(value) ? "'" + value : value;
    });
    tab.getRange(tab.getLastRow() + 1, 1, 1, COLUMNS.length).setNumberFormat('@').setValues([row]);
    SpreadsheetApp.flush();
    return respond({ ok: true, id });
  } catch (error) {
    return errorResponse(error);
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
