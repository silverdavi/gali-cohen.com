import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { Cinemagraph } from './Cinemagraph';
import { formatWorkshopPrice, getUpcomingSectionWorkshops, upcomingWorkshopsTitle, workshopsHeading } from '../cms/queries';
import { clipFor } from '../clips';
import { formatTimeRange } from '../lib/formatDate';

// One-time workshops, apart from the featured "הסדנה הקרובה" slot.
// Renders nothing until a workshop is flagged into this section.
export function UpcomingWorkshops({ home = false }: { home?: boolean }) {
  const items = getUpcomingSectionWorkshops();
  if (!upcomingWorkshopsTitle || items.length === 0) return null;

  const grid = (
    <div className="workshop-teaser-grid">
      {items.map((w, i) => {
        const when = formatTimeRange(w.time, w.endTime);
        return (
          <Reveal key={w.slug} delay={i * 0.06} className="col-third">
            <Link className="workshop-teaser-card" to={`/workshops/${w.slug}`}>
              <div className="workshop-teaser-media">
                {w.image && (
                  <Cinemagraph
                    src={w.image}
                    clip={clipFor(w.image)}
                    alt={w.title}
                    sizes="(max-width: 880px) 92vw, 420px"
                    style={w.imageFocalX != null ? { objectPosition: `${w.imageFocalX}% ${w.imageFocalY ?? 50}%` } : undefined}
                  />
                )}
                {w.status === 'sold-out' && <span className="workshop-badge">אזל</span>}
              </div>
              <h3 className="workshop-teaser-title">{w.title}</h3>
              {w.subtitle && <p className="workshop-teaser-subtitle">{w.subtitle}</p>}
              <p className="workshop-teaser-date">{w.dateLabel}{when && ` · ${when}`}</p>
              <p className="workshop-teaser-meta">{w.location} · {formatWorkshopPrice(w)}</p>
              <span className="workshop-teaser-cta">
                {w.status === 'sold-out' ? 'אזל · לפרטים' : (w.registration || workshopsHeading.cta)}
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );

  if (home) {
    return (
      <section className="section" id="upcoming-workshops">
        <div className="container">
          <SectionHead label={upcomingWorkshopsTitle} title={upcomingWorkshopsTitle} />
          {grid}
        </div>
      </section>
    );
  }

  return (
    <div className="upcoming-workshops" id="upcoming-workshops">
      <SectionHead label={upcomingWorkshopsTitle} title={upcomingWorkshopsTitle} />
      {grid}
    </div>
  );
}
