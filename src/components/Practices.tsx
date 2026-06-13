import { Reveal } from './Reveal';
import { practices } from '../data/content';

export function Practices() {
  return (
    <section className="section" id="practices">
      <div className="container">
        <Reveal>
          <p className="section-label">Practices</p>
          <h2 className="section-title">Ways to work together</h2>
          <p className="section-sub">
            Every journey starts with a conversation. These are the shapes the work usually takes.
          </p>
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
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
