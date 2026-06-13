import { Reveal } from './Reveal';

export function Breath() {
  return (
    <section className="section breath" id="breath">
      <div className="container">
        <Reveal>
          <p className="section-label">A small practice</p>
          <h2 className="section-title">Stay here for one breath</h2>
        </Reveal>
        <div className="breath-stage" role="img" aria-label="A circle that slowly grows and shrinks at a calm breathing pace">
          <div className="breath-ring r3" />
          <div className="breath-ring r2" />
          <div className="breath-ring r1" />
          <div className="breath-core" />
        </div>
        <div className="breath-words" aria-hidden>
          <span className="in">breathe in</span>
          <span className="out">breathe out</span>
        </div>
        <Reveal>
          <p className="breath-note">
            The circle moves at the pace of a slow breath. Follow it once before you keep scrolling — that&rsquo;s the whole practice.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
