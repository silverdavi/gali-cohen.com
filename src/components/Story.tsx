import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { content } from '../content';

// Gali's personal-story lecture ("Body, Faith & Redemption"). Holds the most
// personal images she supplied (her past as a performer), so it lives in its own
// clearly-framed section, gated by the `showStory` flag, and the photos are plain
// stills (never cinemagraphs / hover effects).
export function Story() {
  const { storySection: s } = content;
  return (
    <section className="section story" id="story">
      <div className="container">
        <SectionHead label={s.label} title={s.title} sub={s.lead} />
        <div className="story-grid">
          <Reveal delay={0.06} className="col-main">
            <div className="story-text">
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              <p className="story-meta">{s.meta}</p>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="col-side">
            <div className="story-photos">
              {s.photos.map((ph) => (
                <figure className="story-photo" key={ph.src}>
                  <img src={ph.src} alt={ph.alt} loading="lazy" decoding="async" />
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
