// The client of the shared comment store (test version only).
// The store is a Google Apps Script web app over a Google Sheet (docs/feedback/comments.gs).
// It answers two calls:
//   GET  <url>?page=/about/   -> { ok, comments: [...] }  the comments of that page and all menu comments,
//                                                        without the rows that the team set to "hidden"
//   POST <url>  (JSON body)   -> { ok, id }               adds one row, and answers only after the row is written
// The POST body is sent as text/plain, so the browser does not send a preflight request,
// which Apps Script cannot answer.

export type Kind = 'element' | 'page' | 'menu' | 'question';

export interface NewComment {
  page: string;      // address of the page without the GitHub Pages sub-path, for example /about/
  title: string;     // title of the page
  kind: Kind;
  target: string;    // what the comment is about, in words: "Paragraph: Digital platforms shape …"
  heading: string;   // id of the nearest heading above the element, to find it again
  selector: string;  // CSS path to the element from the nearest element with an id
  snippet: string;   // the first words of the element, to check that the selector still finds it
  quote: string;     // text that the reviewer selected, if any
  comment: string;
  name: string;
  website?: string;  // a field that people do not see; a bot that fills it is ignored
}

export interface StoredComment extends NewComment {
  id: string;
  time: string;
  status: string;    // "open", "done" or "hidden" (the team sets it in the sheet)
}

export async function listComments(url: string, page: string): Promise<StoredComment[]> {
  const res = await fetch(`${url}?page=${encodeURIComponent(page)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`The comment store answered ${res.status}`);
  const data = await res.json();
  if (!data.ok || !Array.isArray(data.comments)) throw new Error('The comment store sent an unexpected answer');
  return data.comments as StoredComment[];
}

/** Adds a comment and returns its id. */
export async function addComment(url: string, comment: NewComment): Promise<string> {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(comment) });
  if (!res.ok) throw new Error(`The comment store answered ${res.status}`);
  const data = await res.json();
  if (!data.ok || !data.id) throw new Error(data.error || 'The comment store did not save the comment');
  return data.id as string;
}
