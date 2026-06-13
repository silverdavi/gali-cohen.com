import { Reveal } from './Reveal';
import { content } from '../content';

export function Contact() {
  const { profile, contact, footer } = content;
  return (
    <>
      <section className="section contact" id="contact">
        <div className="container">
          <Reveal>
            <h2 className="contact-line">{contact.line}</h2>
            <p className="contact-sub">{contact.sub}</p>
            <a className="btn btn-primary" href={`mailto:${profile.email}`}>{profile.email}</a>
            <div className="contact-links">
              <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer">{contact.whatsapp}</a>
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer">{contact.instagram}</a>
            </div>
          </Reveal>
        </div>
      </section>
      <footer className="footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>{footer.place}</span>
      </footer>
    </>
  );
}
