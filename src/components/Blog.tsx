import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { blog, isExternal } from '../content/collections';

// Articles as a card grid. Each card links to the post (falls back to WhatsApp
// while posts are still placeholders, so nothing is a dead end).
export function Blog() {
  const { heading, items } = blog;
  if (items.length === 0) return null;
  return (
    <section className="section" id="blog">
      <div className="container">
        <SectionHead index="06" label={heading.label} title={heading.title} sub={heading.sub} />
        <div className="blog-grid">
          {items.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06} className="col-third">
              <a
                className="article"
                href={a.href}
                {...(isExternal(a.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {a.date && <span className="article-date">{a.date}</span>}
                <h3 className="article-title">{a.title}</h3>
                <p className="article-excerpt">{a.excerpt}</p>
                <span className="article-more">{heading.cta}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
