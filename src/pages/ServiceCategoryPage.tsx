import { Link, useParams } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Cinemagraph } from '../components/Cinemagraph';
import { getServiceCategoryBySlug, formatPrice } from '../cms/queries';
import { content } from '../content';
import { clipFor } from '../clips';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { NotFoundPage } from './NotFoundPage';

export function ServiceCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = categorySlug ? getServiceCategoryBySlug(categorySlug) : undefined;

  useDocumentMeta(
    category ? `${category.title} · גלי גאולה כהן` : 'הדף לא נמצא',
    category?.metaDescription,
  );

  if (!category) return <NotFoundPage />;

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: content.nav.services, path: '/services' }, { label: category.title }]} />
      <SectionHead label="שירותים" title={category.title} sub={category.shortDesc} as="h1" />
      {category.processSteps.length > 0 && (
        <div className="process-steps">
          {category.processSteps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.05} className="process-step">
              <span className="process-step-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-body">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
      {category.tracks.length > 0 ? (
        <div className="practices-list">
          {category.tracks.map((track, i) => (
            <Reveal key={track.title} delay={i * 0.05}>
              <article className="practice">
                <div className="practice-main">
                  {track.note && <p className="practice-meta">{track.note}</p>}
                  <h3 className="practice-title">{track.title}</h3>
                  <p className="practice-body">{track.body}</p>
                  <p className="practice-price">{formatPrice(track.price)}</p>
                </div>
                {track.photo && (
                  <Cinemagraph className="practice-photo" src={track.photo} clip={clipFor(track.photo)} alt={track.photoAlt} />
                )}
              </article>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <div className="category-empty">
            <Cinemagraph className="about-photo" src={category.photo} clip={clipFor(category.photo)} alt={category.photoAlt} />
            <Link className="btn btn-primary" to="/workshops">ללוח הסדנאות הקרובות</Link>
          </div>
        </Reveal>
      )}
    </div>
  );
}
