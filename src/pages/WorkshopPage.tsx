import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { Cinemagraph } from '../components/Cinemagraph';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { WorkshopSignupModal } from '../components/WorkshopSignupModal';
import { getWorkshopBySlug, getRelatedWorkshops, formatPrice } from '../cms/queries';
import { content } from '../content';
import { clipFor } from '../clips';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { NotFoundPage } from './NotFoundPage';

const STATUS_NOTE: Record<string, string> = {
  'sold-out': 'הסדנה מלאה — אפשר להשאיר פרטים לרשימת המתנה.',
  cancelled: 'הסדנה בוטלה.',
  completed: 'הסדנה הזו כבר התקיימה.',
};

// A dated, experiential page rather than a plain product card (brief: hero
// image, emotional intro, what-happens/who-for, practical details, FAQ,
// related workshops) — every piece past the hero/meta/desc/price/CTA that
// already existed is optional and renders nothing until Gali supplies real
// copy for it, same discipline as the rest of the site.
export function WorkshopPage() {
  const { slug } = useParams<{ slug: string }>();
  const w = slug ? getWorkshopBySlug(slug) : undefined;
  const [signingUp, setSigningUp] = useState(false);

  useDocumentMeta(w ? `${w.title} · גלי גאולה כהן` : 'הדף לא נמצא', w?.metaDescription);

  if (!w) return <NotFoundPage />;

  const note = STATUS_NOTE[w.status];
  const canSignUp = w.status === 'upcoming';
  const related = getRelatedWorkshops(w);

  return (
    <div className="container page workshop-page">
      <Breadcrumbs items={[{ label: content.nav.events, path: '/workshops' }, { label: w.title }]} />
      {w.image && (
        <Reveal>
          <div className="workshop-page-media">
            <Cinemagraph src={w.image} clip={clipFor(w.image)} alt={w.title} />
          </div>
        </Reveal>
      )}

      <Reveal delay={0.06} className="workshop-page-body">
        <p className="practice-meta">
          {w.dateLabel}
          {w.time && ` · ${w.time}`}
          {w.location && ` · ${w.location}`}
        </p>
        <h1 className="legal-title">{w.title}</h1>
        {note && <p className="workshop-status-note">{note}</p>}
        {w.intro && <p className="workshop-intro">{w.intro}</p>}

        <div className="legal-body">
          {w.desc.split(/\n{2,}/).map((para, n) => (
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

        {w.whatHappens && (
          <div className="workshop-subsection">
            <h2 className="workshop-subhead">מה קורה בסדנה</h2>
            <p>{w.whatHappens}</p>
          </div>
        )}

        {w.whoFor && (
          <div className="workshop-subsection">
            <h2 className="workshop-subhead">למי זה מתאים</h2>
            <p>{w.whoFor}</p>
          </div>
        )}

        <div className="workshop-practical">
          <div>
            <p className="practice-price">{formatPrice(w.price)}</p>
            {w.capacity && <p className="workshop-capacity">{w.capacity}</p>}
          </div>
          {canSignUp && (
            w.hasSignupLink ? (
              <a className="btn btn-primary workshop-cta" href={w.signupHref} target="_blank" rel="noopener noreferrer">
                לפרטים והרשמה
              </a>
            ) : (
              <button type="button" className="btn btn-primary workshop-cta" onClick={() => setSigningUp(true)}>
                לפרטים והרשמה
              </button>
            )
          )}
        </div>

        {signingUp && <WorkshopSignupModal workshop={w} onClose={() => setSigningUp(false)} />}

        {w.faq.length > 0 && (
          <div className="workshop-faq">
            <h2 className="workshop-subhead">שאלות נפוצות</h2>
            <div className="faq-list">
              {w.faq.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary className="faq-q">
                    {item.q}
                    <span className="faq-mark" aria-hidden />
                  </summary>
                  <p className="faq-a">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}
      </Reveal>

      {related.length > 0 && (
        <div className="workshop-related">
          <h2 className="section-title">סדנאות נוספות שיכולות לעניין אתכם</h2>
          <div className="workshop-teaser-grid">
            {related.map((rw, i) => (
              <Reveal key={rw.slug} delay={i * 0.06} className="col-third">
                <Link className="workshop-teaser-card" to={`/workshops/${rw.slug}`}>
                  <div className="workshop-teaser-media">
                    {rw.image && <Cinemagraph src={rw.image} clip={clipFor(rw.image)} alt={rw.title} />}
                    {rw.status === 'sold-out' && <span className="workshop-badge">אזל</span>}
                  </div>
                  <h3 className="workshop-teaser-title">{rw.title}</h3>
                  <p className="workshop-teaser-date">{rw.dateLabel}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
