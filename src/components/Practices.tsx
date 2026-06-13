import { Reveal } from './Reveal';
import { content } from '../content';
import { features } from '../features';

export function Practices() {
  const { practicesSection, practices } = content;
  return (
    <section className="section" id="practices">
      <div className="container">
        <Reveal>
          <p className="section-label">{practicesSection.label}</p>
          <h2 className="section-title">{practicesSection.title}</h2>
          <p className="section-sub">{practicesSection.sub}</p>
        </Reveal>
        <div className="practices-list">
          {practices.map((p, i) => (
            // rows breathe in from alternating sides, like a slow sway
            <Reveal
              key={p.title}
              delay={i * 0.05}
              y={features.swayReveal ? 14 : 22}
              x={features.swayReveal ? (i % 2 === 0 ? -28 : 28) : 0}
            >
              <article className="practice">
                <div className="practice-main">
                  <p className="practice-meta">{p.note}</p>
                  <h3 className="practice-title">{p.title}</h3>
                  <p className="practice-body">{p.body}</p>
                </div>
                <img className="practice-photo" src={p.photo} alt={p.photoAlt} loading="lazy" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
