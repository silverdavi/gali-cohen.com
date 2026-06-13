import { Reveal } from './Reveal';
import { about } from '../data/content';

export function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <Reveal>
          <p className="section-label">About</p>
          <h2 className="section-title">The long way back to the body</h2>
        </Reveal>
        <div className="about-grid">
          <Reveal delay={0.06}>
            <div className="about-text">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="about-facts">
              {about.facts.map((f) => (
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
