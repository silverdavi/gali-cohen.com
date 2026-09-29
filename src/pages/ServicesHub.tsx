import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Cinemagraph } from '../components/Cinemagraph';
import { getAllServiceCategories, servicesHeading } from '../cms/queries';
import { content } from '../content';
import { clipFor } from '../clips';
import { useDocumentMeta } from '../lib/useDocumentMeta';

export function ServicesHub() {
  const categories = getAllServiceCategories();
  useDocumentMeta(`${servicesHeading.title} · גלי גאולה כהן`, servicesHeading.sub);

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: content.nav.services }]} />
      <SectionHead label={servicesHeading.label} title={servicesHeading.title} sub={servicesHeading.sub} as="h1" />
      <div className="services-grid">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.06} className="col-third">
            <Link className="service-card" to={`/services/${c.slug}`}>
              <div className="service-card-media">
                <Cinemagraph src={c.photo} clip={clipFor(c.photo)} alt={c.photoAlt} />
              </div>
              <h3 className="service-card-title">{c.title}</h3>
              <p className="service-card-desc">{c.shortDesc}</p>
              <span className="service-card-cta">לפרטים ←</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
