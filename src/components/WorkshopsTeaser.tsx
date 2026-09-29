import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { Cinemagraph } from './Cinemagraph';
import { getUpcomingWorkshops, workshopsHeading } from '../cms/queries';
import { clipFor } from '../clips';

// Home teaser: image + name + date + CTA only, per the brief — no description,
// no price. Full details live on /workshops/<slug>.
export function WorkshopsTeaser({ limit }: { limit?: number }) {
  const upcoming = getUpcomingWorkshops(limit);
  const all = getUpcomingWorkshops();
  if (upcoming.length === 0) return null;

  return (
    <section className="section" id="workshops-teaser">
      <div className="container">
        <SectionHead label={workshopsHeading.label} title={workshopsHeading.title} sub={workshopsHeading.sub} />
        <div className="workshop-teaser-grid">
          {upcoming.map((w, i) => (
            <Reveal key={w.slug} delay={i * 0.06} className="col-third">
              <Link className="workshop-teaser-card" to={`/workshops/${w.slug}`}>
                <div className="workshop-teaser-media">
                  {w.image && <Cinemagraph src={w.image} clip={clipFor(w.image)} alt={w.title} />}
                  {w.status === 'sold-out' && <span className="workshop-badge">אזל</span>}
                </div>
                <h3 className="workshop-teaser-title">{w.title}</h3>
                <p className="workshop-teaser-date">{w.dateLabel}</p>
                <span className="workshop-teaser-cta">{workshopsHeading.cta}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        {all.length > upcoming.length && (
          <Reveal delay={0.12}>
            <Link className="btn btn-ghost workshops-all-link" to="/workshops">לכל הסדנאות</Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
