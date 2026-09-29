import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Cinemagraph } from '../components/Cinemagraph';
import { getUpcomingWorkshops, workshopsHeading, workshopsGroup, formatPrice } from '../cms/queries';
import { content } from '../content';
import { clipFor } from '../clips';
import { useDocumentMeta } from '../lib/useDocumentMeta';

// A card grid (not a plain row-list) so the page reads the same whether
// there's one upcoming workshop or many — matches the Home teaser's visual
// language instead of a separate, plainer layout. Past/completed workshops
// are not shown here (their own /workshops/<slug> page still resolves if
// someone already has the link — just not surfaced from this listing).
export function WorkshopsList() {
  const upcoming = getUpcomingWorkshops();
  useDocumentMeta(`${workshopsHeading.title} · גלי גאולה כהן`, workshopsHeading.sub);

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: content.nav.events }]} />
      <SectionHead label={workshopsHeading.label} title={workshopsHeading.title} sub={workshopsHeading.sub} as="h1" />

      {upcoming.length > 0 ? (
        <div className="workshop-teaser-grid">
          {upcoming.map((w, i) => (
            <Reveal key={w.slug} delay={i * 0.06} className="col-third">
              <Link className="workshop-teaser-card" to={`/workshops/${w.slug}`}>
                <div className="workshop-teaser-media">
                  {w.image && <Cinemagraph src={w.image} clip={clipFor(w.image)} alt={w.title} />}
                  {w.status === 'sold-out' && <span className="workshop-badge">אזל</span>}
                </div>
                <h3 className="workshop-teaser-title">{w.title}</h3>
                <p className="workshop-teaser-date">{w.dateLabel}{w.time && ` · ${w.time}`}</p>
                <p className="workshop-teaser-meta">{w.location} · {formatPrice(w.price)}</p>
                <span className="workshop-teaser-cta">
                  {w.status === 'sold-out' ? 'אזל · לפרטים' : workshopsHeading.cta}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="section-sub">כרגע אין אירועים מתוכננים.</p>
      )}

      {workshopsGroup && (
        <Reveal delay={0.1}>
          <a className="events-group" href={workshopsGroup.url} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden focusable="false">
              <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.3A10 10 0 1 0 12 2z" />
            </svg>
            <span>{workshopsGroup.label}</span>
          </a>
        </Reveal>
      )}
    </div>
  );
}
