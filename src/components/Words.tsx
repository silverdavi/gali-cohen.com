import { SectionHead } from './SectionHead';
import { content } from '../content';

// Homepage shows a few short quotes side by side. Longer testimonials keep
// their full wording in the CMS; this only trims the on-page excerpt at a
// sentence boundary so a card stays short.
function shortQuote(quote: string, max = 160): string {
  const flat = quote.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  const window = flat.slice(0, max + 1);
  let cut = -1;
  for (const stop of ['.', '!', '?', '…']) {
    cut = Math.max(cut, window.lastIndexOf(stop));
  }
  if (cut >= 40) return flat.slice(0, cut + 1).trim();
  const space = window.lastIndexOf(' ');
  const base = (space >= 40 ? flat.slice(0, space) : flat.slice(0, max)).replace(/[\s,.:;!-]+$/u, '');
  return `${base}…`;
}

export function Words({ items: itemsProp }: { items?: { quote: string; name: string }[] } = {}) {
  const { wordsSection } = content;
  const items = itemsProp ?? wordsSection.items;
  if (items.length === 0) return null;

  return (
    <section className="section words" id="words">
      <div className="container">
        <SectionHead label={wordsSection.label} />
        <div className="words-grid">
          {items.map((w, n) => (
            <figure className="word" key={w.name + n}>
              <span className="word-mark" aria-hidden>“</span>
              <blockquote>{shortQuote(w.quote)}</blockquote>
              <figcaption>{w.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
