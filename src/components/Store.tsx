import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { Cinemagraph } from './Cinemagraph';
import { store, isExternal } from '../content/collections';
import { features } from '../features';
import { clipFor } from '../clips';

export function Store() {
  const { heading, items } = store;
  if (!features.showStore || items.length === 0) return null;
  return (
    <section className="section" id="shop">
      <div className="container">
        <SectionHead index="07" label={heading.label} title={heading.title} sub={heading.sub} />
        <div className="store-grid">
          {items.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06} className="col-third">
              <article className="product">
                <div className={`product-media${features.photoHover ? ' can-hover' : ''}`}>
                  <Cinemagraph src={p.image} clip={clipFor(p.image)} alt={p.title} />
                </div>
                <div className="product-body">
                  <h3 className="product-title">{p.title}</h3>
                  <p className="product-desc">{p.desc}</p>
                  <div className="product-foot">
                    <span className="product-price">{p.price}</span>
                    <a
                      className="product-cta"
                      href={p.href}
                      {...(isExternal(p.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {heading.cta}
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
