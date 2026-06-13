import { Reveal } from './Reveal';
import { words } from '../data/content';

export function Words() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <p className="section-label">Words from the room</p>
        </Reveal>
        <div className="words-grid">
          {words.map((w, i) => (
            <Reveal key={w.name} delay={i * 0.08}>
              <figure className="word">
                <blockquote>{w.quote}</blockquote>
                <figcaption>{w.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
