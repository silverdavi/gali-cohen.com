import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { faq } from '../content/collections';

// FAQ as native <details> accordions: accessible, keyboard-friendly, and no JS
// state to manage. The first one opens by default so the section isn't a wall
// of closed rows.
export function Faq() {
  const { heading, items } = faq;
  if (items.length === 0) return null;
  return (
    <section className="section" id="faq">
      <div className="container">
        <SectionHead index="05" label={heading.label} title={heading.title} sub={heading.sub} />
        <div className="faq-list">
          {items.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <details className="faq-item" {...(i === 0 ? { open: true } : {})}>
                <summary className="faq-q">
                  <span>{f.q}</span>
                  <span className="faq-mark" aria-hidden />
                </summary>
                <p className="faq-a">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
