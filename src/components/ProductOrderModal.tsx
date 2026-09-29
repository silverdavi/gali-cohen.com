import { useEffect, useState, type FormEvent } from 'react';
import { content, site } from '../content';
import { storeOrderForm, formatProductPrice } from '../cms/queries';
import type { Product } from '../cms/types';

// The order form used when a product has no real checkout link — composes a
// WhatsApp message with the product, price, an optional note, and a name.
export function ProductOrderModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { contact } = content;
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const price = formatProductPrice(product.price, product.salePrice);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // native form-action would submit off-origin — blocked by CSP, and not what we want anyway
    const lines = [
      `היי, אשמח לרכוש: ${product.title} (${price.current})`,
      note.trim(),
      name.trim() ? `— ${name.trim()}` : '',
    ].filter(Boolean);
    window.open(`${site.whatsapp}?text=${encodeURIComponent(lines.join('\n\n'))}`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="reader-scrim" onClick={onClose}>
      <div
        className="reader order-reader"
        role="dialog"
        aria-modal="true"
        aria-label={storeOrderForm.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="reader-close" aria-label="סגירה" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <h2 className="reader-title">{storeOrderForm.title}</h2>
        <p className="order-product">{product.title} · {price.current}</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label htmlFor="order-name">{contact.formName}</label>
            <input
              id="order-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={contact.formNamePlaceholder}
              autoComplete="name"
            />
          </div>
          <div className="contact-field">
            <label htmlFor="order-note">{storeOrderForm.note}</label>
            <textarea
              id="order-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={storeOrderForm.notePlaceholder}
              rows={3}
            />
          </div>
          <button type="submit" className="btn btn-primary contact-form-submit">
            {storeOrderForm.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
