import { Reveal } from './Reveal';
import { content } from '../content';

export function About() {
  const { aboutSection } = content;
  return (
    <section className="section" id="about">
      <div className="container">
        <Reveal>
          <p className="section-label">{aboutSection.label}</p>
          <h2 className="section-title">{aboutSection.title}</h2>
        </Reveal>
        <div className="about-grid">
          <Reveal delay={0.06}>
            <div className="about-text">
              {aboutSection.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="about-facts">
              {aboutSection.facts.map((f) => (
                <div className="fact" key={f.label}>
                  <span className="fact-label">{f.label}</span>
                  <span className="fact-value">{f.value}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
