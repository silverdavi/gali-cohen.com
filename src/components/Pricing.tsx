import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { pricing, isExternal } from '../content/collections';
import { features } from '../features';

export function Pricing() {
  const { heading, items } = pricing;
  if (!features.showPricing || items.length === 0) return null;
  return (
    <section className="section" id="pricing">
      <div className="container">
        <SectionHead index="05" label={heading.label} title={heading.title} sub={heading.sub} />
        <div className="price-list">
          {items.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06} className="col-third">
              <article className={`price-card${p.featured ? ' is-featured' : ''}`}>
                <div className="price-head">
                  <h3 className="price-title">{p.title}</h3>
                  <p className="price-unit">{p.unit}</p>
                </div>
                <p className="price-amount">{p.price}</p>
                <p className="price-note">{p.note}</p>
                <a
                  className="price-cta"
                  href={p.href}
                  {...(isExternal(p.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {heading.cta}
                  <span className="price-cta-rule" aria-hidden />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
