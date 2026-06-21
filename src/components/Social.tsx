import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { content, site } from '../content';

// "Link to all my social" — renders every social link with a non-empty URL.
// Editable as a list in the CMS (site.yaml → socials); empty rows stay hidden.
export function Social() {
  const { socialSection } = content;
  const links = (site.socials ?? []).filter((s) => s.url && s.url.trim());
  if (links.length === 0) return null;
  return (
    <section className="section social-section" id="social">
      <div className="container">
        <SectionHead label={socialSection.label} title={socialSection.title} sub={socialSection.sub} />
        <Reveal>
          <div className="social-row">
            {links.map((s) => (
              <a
                key={s.label}
                className="social-link"
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
