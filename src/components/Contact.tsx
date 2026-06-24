import { Reveal } from './Reveal';
import { content, site } from '../content';
import { features } from '../features';
import { useMagnetic } from '../useMagnetic';
import { Cinemagraph } from './Cinemagraph';
import { clipFor } from '../clips';
import { BrandIcon } from './BrandIcon';

// "פרטי קשר" — the contact + social hub. WhatsApp is the prominent button; the
// rest of the networks (and email) sit below as labelled brand icons. Social
// links come from site.yaml → socials; empty URLs are skipped.
export function Contact() {
  const { contact, nav } = content;
  const magnetic = useMagnetic();
  const links = [
    ...(site.socials ?? []).filter((s) => s.url && s.url.trim() && s.label.toLowerCase() !== 'whatsapp'),
    ...(site.email ? [{ label: 'Email', url: `mailto:${site.email}` }] : []),
  ];
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <Reveal>
          <p className="section-label" style={{ justifyContent: 'center' }}>{nav.contact}</p>
          <div className={`contact-medallion${features.medallionSpin ? ' spin' : ''}`} aria-hidden>
            <Cinemagraph src="/photos/bowl.jpg" clip={clipFor('/photos/bowl.jpg')} ariaHidden />
          </div>
          <h2 className="contact-line">{contact.line}</h2>
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
                  <BrandIcon name={s.label} />
                </a>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
