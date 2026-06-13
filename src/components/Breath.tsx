import { Reveal } from './Reveal';
import { KineticText } from './KineticText';
import { content } from '../content';
import { features } from '../features';

export function Breath() {
  const { breath } = content;
  return (
    <section className={`section breath${features.breathDark ? ' breath-night' : ''}`} id="breath">
      <div className="container">
        <Reveal>
          <p className="section-label">{breath.label}</p>
        </Reveal>
        <KineticText as="h2" className="section-title" text={breath.title} />
        <div className={`breath-stage${features.breathStage ? '' : ' still'}`} role="img" aria-label={breath.note}>
          <div className="breath-rays" />
          <div className="breath-target" />
          <div className="breath-ring r3" />
          <div className="breath-ring r2" />
          <div className="breath-ring r1" />
          <div className="breath-ripple" />
          <div className="breath-ripple p2" />
          <div className="breath-glow" />
          <div className="breath-core" />
          <div className="breath-words" aria-hidden>
            <span className="in">{breath.wordIn}</span>
            <span className="hold">{breath.wordHold}</span>
            <span className="out">{breath.wordOut}</span>
          </div>
        </div>
        <Reveal>
          <p className="breath-note">{breath.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
