import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Cinemagraph } from '../components/Cinemagraph';
import { getListedUpcomingWorkshops, workshopsHeading, workshopsGroup, formatWorkshopPrice } from '../cms/queries';
import { formatTimeRange } from '../lib/formatDate';
import { workshopWhatsappHref } from '../lib/workshopWhatsapp';
import { content } from '../content';
import { clipFor } from '../clips';
import { useDocumentMeta } from '../lib/useDocumentMeta';

// A card grid (not a plain row-list) so the page reads the same whether
// there's one upcoming workshop or many — matches the Home teaser's visual
// language instead of a separate, plainer layout. Past/completed workshops
// are not shown here (their own /workshops/<slug> page still resolves if
// someone already has the link — just not surfaced from this listing).
export function WorkshopsList() {
  const upcoming = getListedUpcomingWorkshops();
  useDocumentMeta(`${workshopsHeading.title} · גלי גאולה כהן`);

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: content.nav.events }]} />
      <SectionHead label={workshopsHeading.label} title={workshopsHeading.title} sub={workshopsHeading.sub} as="h1" />

      {upcoming.length > 0 ? (
        <div className="workshop-teaser-grid">
          {upcoming.map((w, i) => {
            const when = formatTimeRange(w.time, w.endTime);
            const whatsappCta = w.hasSignupLink && w.status !== 'sold-out';
            const body = (
              <>
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
              </>
            );
            const ctaLabel = w.status === 'sold-out' ? 'אזל · לפרטים' : (w.registration || workshopsHeading.cta);
            return (
            <Reveal key={w.slug} delay={i * 0.06} className="col-third">
              {whatsappCta ? (
                <div className="workshop-teaser-card">
                  <Link className="workshop-teaser-card-link" to={`/workshops/${w.slug}`}>{body}</Link>
                  <a className="workshop-teaser-cta" href={workshopWhatsappHref(w)} target="_blank" rel="noopener noreferrer">
                    {workshopsHeading.cta}
                  </a>
                </div>
              ) : (
                <Link className="workshop-teaser-card" to={`/workshops/${w.slug}`}>
                  {body}
                  <span className="workshop-teaser-cta">{ctaLabel}</span>
                </Link>
              )}
            </Reveal>
            );
          })}
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
