import { Reveal } from './Reveal';
import { content, site } from '../content';
import { features } from '../features';
import { useMagnetic } from '../useMagnetic';
import { Cinemagraph } from './Cinemagraph';
import { clipFor } from '../clips';

export function Contact() {
  const { profile, contact, footer } = content;
  const magnetic = useMagnetic();
  return (
    <>
      <section className="section contact" id="contact">
        <div className="container">
          <Reveal>
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
            <div className="contact-links">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer">{contact.instagram}</a>
            </div>
          </Reveal>
        </div>
      </section>
      <footer className="footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>{footer.place}</span>
        <span className="footer-credit">{footer.credit}</span>
        <span className="footer-build" title="build version">{__BUILD_ID__}</span>
      </footer>
    </>
  );
}
