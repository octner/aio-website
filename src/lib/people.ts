// People pages (front matter "people: true"). Editors write each person as plain Markdown:
//   ### Name, then the photo, then the role, then a short text.
// This step wraps each person in a card and puts the cards of each section in a grid of two columns.
// A person without a photo gets a placeholder of the same size with the initials.

const TITLES = /^(prof|professor|dr|ms|mr|mrs|assoc|a\/prof)\.?\s+/i;

function initials(name: string): string {
  const words = name.replace(/<[^>]+>/g, '').replace(TITLES, '').trim().split(/\s+/);
  return (words[0]?.[0] ?? '') + (words.length > 1 ? words[words.length - 1][0] : '');
}

function personCard(chunk: string): string {
  const heading = chunk.match(/^<h3[^>]*>([\s\S]*?)<\/h3>/);
  if (!heading) return chunk;
  let rest = chunk.slice(heading[0].length).trim();
  const photo = rest.match(/^<p>\s*(<img\b[^>]*>)\s*<\/p>/);
  let figure: string;
  if (photo) {
    rest = rest.slice(photo[0].length).trim();
    figure = `<div class="person-photo">${photo[1].replace('<img', '<img loading="lazy"')}</div>`;
  } else {
    figure = `<div class="person-photo person-initials" aria-hidden="true">${initials(heading[1])}</div>`;
  }
  return `<article class="person">${figure}<div class="person-text">${heading[0]}${rest}</div></article>`;
}

export function withPeople(html: string): string {
  // Split before each level-2 or level-3 heading. Each piece that starts with <h3 is one person.
  const pieces = html.split(/(?=<h[23][\s>])/);
  let out = '';
  let group: string[] = [];
  const flush = () => {
    if (group.length) out += `<div class="people">${group.join('')}</div>`;
    group = [];
  };
  for (const piece of pieces) {
    if (piece.startsWith('<h3')) group.push(personCard(piece.trim()));
    else { flush(); out += piece; }
  }
  flush();
  return out;
}
