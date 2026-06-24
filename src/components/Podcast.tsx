import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { podcast, isExternal } from '../content/collections';

// Two shows, side by side. A show with a status (e.g. "בקרוב") shows a quiet
// "coming soon" badge instead of a listen link.
export function Podcast() {
  const { heading, shows } = podcast;
  if (shows.length === 0) return null;
  return (
    <section className="section" id="podcast">
      <div className="container">
        <SectionHead index="05" label={heading.label} title={heading.title} sub={heading.sub} />
        <div className="shows-grid">
          {shows.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <article className={`show${s.status ? ' is-soon' : ''}`}>
                <span className="show-play" aria-hidden>
                  <svg viewBox="0 0 24 24" focusable="false"><path d="M8 5v14l11-7z" /></svg>
                </span>
                <h3 className="show-name">{s.name}</h3>
                <p className="show-desc">{s.desc}</p>
                {s.status ? (
                  <span className="show-soon">{s.status}</span>
                ) : (
                  <a
                    className="show-cta"
                    href={s.href}
                    {...(isExternal(s.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {heading.cta || 'להאזנה'}
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
