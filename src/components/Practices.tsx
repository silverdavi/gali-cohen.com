import { Reveal } from './Reveal';
import { content } from '../content';

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
            <Reveal key={p.title} delay={i * 0.05}>
              <article className="practice">
                <div className="practice-meta">{p.note}</div>
                <div>
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
