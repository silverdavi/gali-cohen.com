import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { Cinemagraph } from './Cinemagraph';
import { content } from '../content';
import { clipFor } from '../clips';

export function About() {
  const { aboutSection } = content;
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead index="03" label={aboutSection.label} title={aboutSection.title} />
        <div className="about-grid">
          <Reveal delay={0.06} className="col-main">
            <div className="about-text">
              {aboutSection.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12} className="col-side">
            <div>
              <Cinemagraph
                className="about-photo"
                src={aboutSection.photo}
                clip={clipFor(aboutSection.photo)}
                alt={aboutSection.photoAlt}
              />
              <div className="about-facts">
                {aboutSection.facts.map((f) => (
                  <div className="fact" key={f.label}>
                    <span className="fact-label">{f.label}</span>
                    <span className="fact-value">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
