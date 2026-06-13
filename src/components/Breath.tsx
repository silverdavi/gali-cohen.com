import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Reveal } from './Reveal';
import { KineticText } from './KineticText';
import { content } from '../content';
import { features } from '../features';

export function Breath() {
  const { breath } = content;
  const organicEdge = features.breathDark && features.breathOrganicEdge;
  const showGuide = features.breathGuide && features.breathStage;

  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // As the section travels from entering the viewport to centred, the stage
  // settles into place (scale + fade). It's a one-way reveal layered on top of
  // the circle's own breathing, so the two never fight.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [0.35, 1]);
  const scrollReveal = features.breathScrollReveal && !reduce;

  return (
    <section ref={ref} className={`section breath${features.breathDark ? ' breath-night' : ''}`} id="breath">
      {organicEdge && <div className="breath-veil top" aria-hidden />}
      {organicEdge && <div className="breath-veil bottom" aria-hidden />}
      <div className="container">
        <Reveal>
          <p className="section-label">{breath.label}</p>
        </Reveal>
        <KineticText as="h2" className="section-title" text={breath.title} />
        <motion.div className="breath-stage-wrap" style={scrollReveal ? { scale, opacity } : undefined}>
          <div className={`breath-stage${features.breathStage ? '' : ' still'}`} role="img" aria-label={breath.note}>
            <div className="breath-rays" />
            <div className="breath-target" />
            <div className="breath-ring r3" />
            <div className="breath-ring r2" />
            <div className="breath-ring r1" />
            {showGuide && (
              <svg className="breath-progress" viewBox="0 0 100 100" aria-hidden>
                <circle className="breath-progress-track" cx="50" cy="50" r="47" pathLength="100" />
                <circle className="breath-progress-arc" cx="50" cy="50" r="47" pathLength="100" />
              </svg>
            )}
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
        </motion.div>
        <Reveal>
          <p className="breath-note">{breath.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
