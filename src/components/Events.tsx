import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { events, isExternal } from '../content/collections';
import { features } from '../features';

export function Events() {
  const { heading, items } = events;
  if (!features.showEvents || items.length === 0) return null;
  return (
    <section className="section" id="events">
      <div className="container">
        <SectionHead index="06" label={heading.label} title={heading.title} sub={heading.sub} />
        <div className="event-list">
          {items.map((e, i) => (
            <Reveal key={`${e.iso}-${e.title}`} delay={i * 0.05}>
              <article className="event">
                <div className="event-date" aria-hidden>
                  <span className="event-day">{e.day}</span>
                  <span className="event-month">{e.month}</span>
                </div>
                <div className="event-main">
                  <h3 className="event-title">{e.title}</h3>
                  <p className="event-meta">
                    <span>{e.dateLabel}</span>
                    {e.time && <span className="event-dot" aria-hidden>·</span>}
                    {e.time && <span>{e.time}</span>}
                    <span className="event-dot" aria-hidden>·</span>
                    <span>{e.location}</span>
                  </p>
                  <p className="event-desc">{e.desc}</p>
                </div>
                <a
                  className="event-cta"
                  href={e.href}
                  {...(isExternal(e.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {heading.cta}
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
