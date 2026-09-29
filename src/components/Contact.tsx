import { useState, type FormEvent } from 'react';
import { Reveal } from './Reveal';
import { Breadcrumbs } from './Breadcrumbs';
import { content, site } from '../content';
import { features } from '../features';
import { useMagnetic } from '../useMagnetic';
import { Cinemagraph } from './Cinemagraph';
import { clipFor } from '../clips';
import { BrandIcon } from './BrandIcon';
import { hasBrandIcon } from '../lib/brandIcon';

// The contact + social hub — used both standalone (/contact, via
// ContactPage.tsx) and embedded as Home's closing section. No own
// <section>/<container> of its own (each caller supplies that), just
// id="contact" on this block. WhatsApp is the prominent button; a short form
// beneath it composes a message and hands it to WhatsApp (there's no backend
// on this static site — and WhatsApp is already how every other CTA on the
// page gets in touch); the rest of the networks (and email) sit below as
// labelled brand icons. Social links come from site.yaml → socials; empty
// URLs — and any label BrandIcon can't draw a glyph for — are skipped, so a
// CMS typo never leaves a blank, clickable circle sitting in the middle of
// the site's one conversion block.
export function Contact({ titleAs: Title = 'h2' }: { titleAs?: 'h1' | 'h2' } = {}) {
  const { contact } = content;
  const magnetic = useMagnetic();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // native form-action would submit off-origin — blocked by CSP, and not what we want anyway
    const text = name.trim() ? `${message.trim()}\n\n— ${name.trim()}` : message.trim();
    window.open(`${site.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const links = [
    ...(site.socials ?? []).filter(
      (s) => s.url && s.url.trim() && s.label.toLowerCase() !== 'whatsapp' && hasBrandIcon(s.label, s.url),
    ),
    ...(site.email ? [{ label: 'Email', url: `mailto:${site.email}` }] : []),
  ];
  return (
    <div className="contact" id="contact">
      {Title === 'h1' && <Breadcrumbs items={[{ label: content.nav.contact }]} />}
      <Reveal>
        <div className={`contact-medallion${features.medallionSpin ? ' spin' : ''}`} aria-hidden>
          <Cinemagraph src="/photos/bowl.jpg" clip={clipFor('/photos/bowl.jpg')} ariaHidden />
        </div>
        <Title className="contact-line">{contact.line}</Title>
        <p className="contact-sub">{contact.sub}</p>
        <a
          className="btn btn-primary btn-whatsapp"
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          {...magnetic}
        >
          {contact.whatsapp}
        </a>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label htmlFor="contact-name">{contact.formName}</label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={contact.formNamePlaceholder}
              autoComplete="name"
            />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-message">{contact.formMessage}</label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={contact.formMessagePlaceholder}
              rows={4}
              required
            />
          </div>
          <button type="submit" className="btn btn-ghost contact-form-submit">
            {contact.formSubmit}
          </button>
          <p className="contact-form-note">{contact.formNote}</p>
        </form>

        {links.length > 0 && (
          <div className="social-icons">
            {links.map((s) => (
              <a
                key={s.label}
                className="social-icon"
                href={s.url}
                aria-label={s.label}
                title={s.label}
                {...(s.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <BrandIcon name={s.label} url={s.url} />
              </a>
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}
