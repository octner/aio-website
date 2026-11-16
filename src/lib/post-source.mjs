// Reads a post file for the post editor (/editor/): the front matter fields that the editor shows, the
// text, and the git blob sha of the file. The sha lets the store refuse an edit when the post changed on
// GitHub after this build (docs/feedback/posts.gs). The test scripts/test-post-store.mjs uses it too.
//
// A post is "editable" only when the form can show and save every one of its fields exactly. Other posts,
// for example one with a summary on two lines or a date with a time, stay out of the editor, so a save
// can never shorten or change them. Pages CMS and GitHub's file editor can still edit them.
import { createHash } from 'node:crypto';

/** The fields that the editor sets. posts.gs copies every other field of the file unchanged. */
export const FORM_FIELDS = ['title', 'date', 'type', 'summary', 'author', 'image', 'imageAlt', 'eventStart', 'eventEnd', 'allDay', 'location', 'registration', 'draft'];
const BOOLEANS = ['allDay', 'draft'];

/** The sha that git and the GitHub contents API give to a file with these bytes. */
export function gitBlobSha(bytes) {
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

/** One-line YAML value: returns the text, or null when the editor cannot keep it exactly. */
function scalar(raw) {
  const v = raw.trim();
  if (v.startsWith('"')) {
    try { const s = JSON.parse(v); return typeof s === 'string' ? s : null; } catch { return null; }
  }
  if (v.startsWith("'")) return v.endsWith("'") && v.length > 1 ? v.slice(1, -1).replace(/''/g, "'") : null;
  if (/^[|>&*!{[]/.test(v) || / #/.test(v)) return null; // block text, anchors, tags, lists or a comment
  return v;
}

/**
 * @param {string} text the whole file
 * @returns {{ fields: Record<string, string>, body: string, editable: boolean, reason: string }}
 */
export function readPostSource(text) {
  const fields = Object.fromEntries(FORM_FIELDS.map((key) => [key, '']));
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return { fields, body: text, editable: false, reason: 'no front matter' };
  let reason = '';
  let current = '';
  for (const line of m[1].split(/\r?\n/)) {
    const field = /^([A-Za-z]\w*):\s*(.*)$/.exec(line);
    if (field) {
      current = field[1];
      if (!FORM_FIELDS.includes(current)) continue;
      const value = scalar(field[2]);
      if (value === null) reason ||= `the field ${current} has a form that the editor cannot keep`;
      else fields[current] = value;
    } else if (line.trim() && FORM_FIELDS.includes(current)) {
      reason ||= `the field ${current} continues on a second line`;
    }
  }
  for (const key of BOOLEANS) {
    if (fields[key] === 'false') fields[key] = '';
    else if (fields[key] !== '' && fields[key] !== 'true') reason ||= `the field ${key} is not true or false`;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) reason ||= 'the date is not written as YYYY-MM-DD';
  return { fields, body: m[2].replace(/^\r?\n/, ''), editable: !reason, reason };
}
