import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Reveal } from './Reveal';
import { content } from '../content';

const SLOTS = 10;
const FIGURES = 9; // one slot kept open for the dancer who joins on hover

// One dancing figure: head + open-armed body, drawn pointing outward from center.
function Figure({ angle, className }: { angle: number; className?: string }) {
  return (
    <g className={className} transform={`rotate(${angle} 140 140) translate(140 38)`}>
      <circle cx="0" cy="0" r="7" fill="var(--accent)" />
      {/* body */}
      <path d="M0 7 V 34" stroke="var(--ink)" strokeWidth="3.4" strokeLinecap="round" />
      {/* arms raised toward neighbors */}
      <path d="M0 14 Q -12 8 -19 -1" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M0 14 Q 12 8 19 -1" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* legs mid-step */}
      <path d="M0 34 Q -7 44 -10 52" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M0 34 Q 8 43 9 52" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}

export function Circle() {
  const { circle } = content;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // The dancers turn with you: scrolling through the section adds a slow
  // quarter-turn on top of the circle's own spin.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-45, 45]);

  return (
    <section className="section" id="circle" ref={ref}>
      <div className="container">
        <Reveal>
          <p className="section-label">{circle.label}</p>
          <h2 className="section-title">{circle.title}</h2>
        </Reveal>
        <div className="circle-grid">
          <Reveal y={28}>
            <motion.div style={reduce ? undefined : { rotate }} className="dance-wrap">
              <svg className="dance" viewBox="0 0 280 280" role="img" aria-label={circle.alt}>
                <circle className="dance-ring" cx="140" cy="140" r="64" fill="none" stroke="var(--rule)" strokeWidth="1.5" strokeDasharray="3 7" />
                <g className="turning">
                  {Array.from({ length: FIGURES }, (_, i) => (
                    <Figure key={i} angle={(360 / SLOTS) * i} />
                  ))}
                  {/* the open slot; a tenth dancer joins on hover */}
                  <Figure className="joiner" angle={(360 / SLOTS) * FIGURES} />
                </g>
                <circle className="dance-heart" cx="140" cy="140" r="5" fill="var(--ochre)" />
              </svg>
            </motion.div>
            <p className="circle-caption">{circle.caption}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="section-sub">{circle.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
