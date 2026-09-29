import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Cinemagraph } from '../components/Cinemagraph';
import { ProductOrderModal } from '../components/ProductOrderModal';
import { getProductBySlug, formatProductPrice, isExternal } from '../cms/queries';
import { content } from '../content';
import { clipFor } from '../clips';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { NotFoundPage } from './NotFoundPage';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  const [ordering, setOrdering] = useState(false);

  useDocumentMeta(product ? `${product.title} · חנות · גלי גאולה כהן` : 'הדף לא נמצא', product?.desc);

  if (!product) return <NotFoundPage />;
  const price = formatProductPrice(product.price, product.salePrice);

  return (
    <div className="container legal-container">
      <Breadcrumbs items={[{ label: content.nav.shop, path: '/store' }, { label: product.title }]} />
      <div className="workshop-page-media">
        <Cinemagraph src={product.image} clip={clipFor(product.image)} alt={product.title} />
      </div>
      <h1 className="legal-title">{product.title}</h1>
      <p className="practice-price">
        {price.original && <s className="product-price-original">{price.original}</s>}
        {price.current}
      </p>
      <div className="legal-body">
        <p>{product.desc}</p>
      </div>
      {product.hasCheckout ? (
        <a className="btn btn-primary" href={product.href} {...(isExternal(product.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          לרכישה
        </a>
      ) : (
        <button type="button" className="btn btn-primary" onClick={() => setOrdering(true)}>
          לרכישה
        </button>
      )}
      {ordering && <ProductOrderModal product={product} onClose={() => setOrdering(false)} />}
    </div>
  );
}
