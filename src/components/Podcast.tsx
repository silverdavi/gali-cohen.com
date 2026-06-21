import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { podcast, isExternal } from '../content/collections';

// Episode list with a show-level subscribe link in the header. Episodes link out
// to the platform (or fall back to WhatsApp while still placeholders).
export function Podcast() {
  const { heading, items, link } = podcast;
  if (items.length === 0) return null;
  return (
    <section className="section" id="podcast">
      <div className="container">
        <SectionHead index="07" label={heading.label} title={heading.title} sub={heading.sub} />
        <div className="podcast-list">
          {items.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.05}>
              <a
                className="episode"
                href={e.href}
                {...(isExternal(e.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className="episode-play" aria-hidden>
                  <svg viewBox="0 0 24 24" focusable="false"><path d="M8 5v14l11-7z" /></svg>
                </span>
                <span className="episode-body">
                  <span className="episode-title">{e.title}</span>
                  <span className="episode-desc">{e.desc}</span>
                </span>
                {e.duration && <span className="episode-dur">{e.duration}</span>}
              </a>
            </Reveal>
          ))}
        </div>
        {heading.cta && (
          <Reveal delay={0.1}>
            <a
              className="podcast-subscribe"
              href={link}
              {...(isExternal(link) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {heading.cta}
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
