import { useEffect, useState, type FormEvent } from 'react';
import { content, site } from '../content';
import { formatPrice } from '../cms/queries';
import type { Workshop } from '../cms/types';

// The signup form used when a workshop has no real external registration
// link (signupUrl empty in the CMS — checked via hasSignupLink, same pattern
// as Product.hasCheckout) — composes a WhatsApp message with the workshop's
// own real details (title, date, time, location, price — nothing invented)
// plus whatever the visitor filled in.
export function WorkshopSignupModal({ workshop, onClose }: { workshop: Workshop; onClose: () => void }) {
  const { contact } = content;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

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
      `היי, אשמח להירשם לסדנה: ${workshop.title}`,
      `${workshop.dateLabel}${workshop.time ? ` · ${workshop.time}` : ''}${workshop.location ? ` · ${workshop.location}` : ''}`,
      formatPrice(workshop.price),
      '',
      name.trim() ? `שם: ${name.trim()}` : '',
      email.trim() ? `אימייל: ${email.trim()}` : '',
      phone.trim() ? `טלפון: ${phone.trim()}` : '',
    ].filter(Boolean);
    window.open(`${site.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="reader-scrim" onClick={onClose}>
      <div
        className="reader order-reader"
        role="dialog"
        aria-modal="true"
        aria-label="הרשמה לסדנה"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="reader-close" aria-label="סגירה" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <h2 className="reader-title">הרשמה לסדנה</h2>
        <p className="order-product">{workshop.title} · {formatPrice(workshop.price)}</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label htmlFor="signup-name">{contact.formName}</label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={contact.formNamePlaceholder}
              autoComplete="name"
              required
            />
          </div>
          <div className="contact-field">
            <label htmlFor="signup-email">אימייל</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
            />
          </div>
          <div className="contact-field">
            <label htmlFor="signup-phone">טלפון</label>
            <input
              id="signup-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="050-1234567"
              autoComplete="tel"
            />
          </div>
          <button type="submit" className="btn btn-primary contact-form-submit">
            {contact.formSubmit}
          </button>
        </form>
      </div>
    </div>
  );
}
