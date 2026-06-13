import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { activities } from '../content/collections';
import { features } from '../features';

export function Practices() {
  const { heading, items } = activities;
  return (
    <section className="section" id="practices">
      <div className="container">
        <SectionHead
          index="01"
          label={heading.label}
          title={heading.title}
          sub={heading.sub}
        />
        <div className="practices-list">
          {items.map((p, i) => (
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
