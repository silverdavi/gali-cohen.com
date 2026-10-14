import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { Cinemagraph } from './Cinemagraph';
import { getHomepageWorkshops, getListedUpcomingWorkshops, workshopsHeading } from '../cms/queries';
import { clipFor } from '../clips';
import { formatTimeRange } from '../lib/formatDate';
import { workshopWhatsappHref } from '../lib/workshopWhatsapp';

// Home teaser: image + name + date + CTA only, per the brief — no description,
// no price. Full details live on /workshops/<slug>.
export function WorkshopsTeaser({ limit }: { limit?: number }) {
  const upcoming = getHomepageWorkshops(limit);
  const all = getListedUpcomingWorkshops();
  if (upcoming.length === 0) return null;

  return (
    <section className="section" id="workshops-teaser">
      <div className="container">
        <SectionHead label={workshopsHeading.label} title={workshopsHeading.title} sub={workshopsHeading.sub} />
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
        {all.length > upcoming.length && (
          <Reveal delay={0.12}>
            <Link className="btn btn-ghost workshops-all-link" to="/workshops">לכל הסדנאות</Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
