import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { content } from '../content';

export function Words() {
  const { wordsSection } = content;
  return (
    <section className="section" id="words">
      <div className="container">
        <SectionHead label={wordsSection.label} />
        <div className="words-grid">
          {wordsSection.items.map((w, i) => (
            <Reveal key={w.name} delay={i * 0.08} className="col-half">
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
