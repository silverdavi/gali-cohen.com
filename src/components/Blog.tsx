import { useEffect, useState } from 'react';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { blog, isExternal, type Article } from '../content/collections';

// Articles as a card grid. A post with a body opens in an on-page reader
// (modal); a post with only a link goes out to that link. Posts are written in
// the CMS — the "Body" field is the full article.
export function Blog() {
  const { heading, items } = blog;
  const [open, setOpen] = useState<Article | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <section className="section" id="blog">
      <div className="container">
        <SectionHead index="06" label={heading.label} title={heading.title} sub={heading.sub} />
        <div className="blog-grid">
          {items.map((a, i) => {
            const inner = (
              <>
                {a.date && <span className="article-date">{a.date}</span>}
                <h3 className="article-title">{a.title}</h3>
                <p className="article-excerpt">{a.excerpt}</p>
                <span className="article-more">{heading.cta || 'לקריאה'}</span>
              </>
            );
            return (
              <Reveal key={a.title} delay={i * 0.06} className="col-third">
                {a.body ? (
                  <button type="button" className="article" onClick={() => setOpen(a)}>
                    {inner}
                  </button>
                ) : (
                  <a
                    className="article"
                    href={a.href || undefined}
                    {...(a.href && isExternal(a.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {inner}
                  </a>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>

      {open && (
        <div className="reader-scrim" onClick={() => setOpen(null)}>
          <article
            className="reader"
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="reader-close" aria-label="סגירה" onClick={() => setOpen(null)}>
              <svg viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            {open.date && <span className="reader-date">{open.date}</span>}
            <h2 className="reader-title">{open.title}</h2>
            <div className="reader-body">
              {open.body.split(/\n{2,}/).map((para, n) => (
                <p key={n}>
                  {para.split('\n').map((line, m, arr) => (
                    <span key={m}>
                      {line}
                      {m < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
