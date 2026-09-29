import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { Breadcrumbs } from './Breadcrumbs';
import { Cinemagraph } from './Cinemagraph';
import { ProductOrderModal } from './ProductOrderModal';
import { getAllProducts, storeHeading, formatProductPrice, isExternal } from '../cms/queries';
import { content } from '../content';
import type { Product } from '../cms/types';
import { features } from '../features';
import { clipFor } from '../clips';

// Self-contained (own <section>+<container>) so it works both as the /store
// route's content and embedded as a home teaser — no title/meta side effect
// here, since embedding it on Home must not clobber Home's own title
// (see pages/StorePage.tsx, which wraps this for the standalone route).
//
// A product with its own buyUrl (a real checkout page) links straight out —
// that page collects its own details. One without falls back to a WhatsApp
// order form (name + optional note) instead of a bare, contextless chat.
export function Store({ titleAs = 'h2' }: { titleAs?: 'h1' | 'h2' }) {
  const items = getAllProducts();
  const [active, setActive] = useState<Product | null>(null);

  if (!features.showStore || items.length === 0) return null;

  return (
    <section className="section" id="shop">
      <div className="container">
        {titleAs === 'h1' && <Breadcrumbs items={[{ label: content.nav.shop }]} />}
        <SectionHead label={storeHeading.label} title={storeHeading.title} sub={storeHeading.sub} as={titleAs} />
        <div className="store-grid">
          {items.map((p, i) => {
            const price = formatProductPrice(p.price, p.salePrice);
            // The media/title/desc link to the detail page (when there is one) —
            // the price+CTA row stays a sibling, never nested inside that link,
            // since it's its own interactive element (button or anchor).
            const media = (
              <div className={`product-media${features.photoHover ? ' can-hover' : ''}`}>
                <Cinemagraph src={p.image} clip={clipFor(p.image)} alt={p.title} />
              </div>
            );
            const titleBlock = (
              <>
                <h3 className="product-title">{p.title}</h3>
                <p className="product-desc">{p.desc}</p>
              </>
            );
            return (
              <Reveal key={p.title} delay={i * 0.06} className="col-third">
                <article className="product">
                  {p.slug ? <Link to={`/store/${p.slug}`}>{media}</Link> : media}
                  <div className="product-body">
                    {p.slug ? (
                      <Link className="product-info" to={`/store/${p.slug}`}>{titleBlock}</Link>
                    ) : (
                      <div className="product-info">{titleBlock}</div>
                    )}
                    <div className="product-foot">
                      <span className="product-price">
                        {price.original && <s className="product-price-original">{price.original}</s>}
                        {price.current}
                      </span>
                      {p.hasCheckout ? (
                        <a className="product-cta" href={p.href} {...(isExternal(p.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                          {storeHeading.cta}
                        </a>
                      ) : (
                        <button type="button" className="product-cta" onClick={() => setActive(p)}>
                          {storeHeading.cta}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {active && <ProductOrderModal product={active} onClose={() => setActive(null)} />}
      </div>
    </section>
  );
}
