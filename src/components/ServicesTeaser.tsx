import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { Cinemagraph } from './Cinemagraph';
import { getAllServiceCategories, servicesHeading } from '../cms/queries';
import { clipFor } from '../clips';

// Home teaser: the three fixed service categories as large editorial rows
// (photo one side, text the other, alternating down the section) rather than
// a card grid — reuses the exact row/alternation pattern already proven on
// ServiceCategoryPage's tracks list (.practices-list/.practice), so the CTA-
// driving section right after the hero reads as a considered sequence rather
// than a fourth near-identical 3-card grid down the home page. No track/price
// detail here, that lives on the category page.
export function ServicesTeaser() {
  const categories = getAllServiceCategories();
  if (categories.length === 0) return null;
  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHead label={servicesHeading.label} title={servicesHeading.title} sub={servicesHeading.sub} />
        <div className="practices-list">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link className="practice" to={`/services/${c.slug}`}>
                <div className="practice-main">
                  <h3 className="practice-title">{c.title}</h3>
                  <p className="practice-body">{c.shortDesc}</p>
                  <span className="service-card-cta">לפרטים ←</span>
                </div>
                <Cinemagraph className="practice-photo" src={c.photo} clip={clipFor(c.photo)} alt={c.photoAlt} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
