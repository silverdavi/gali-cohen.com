import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

// 70s arch window with stacked sun arcs over a sea horizon. As you scroll
// past the hero the sun sets behind the swell and the birds lift away.
// On hover the sun blooms: rays unfurl and the arcs swell warmly.
export function ArchSun() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const sunY = useTransform(scrollYProgress, [0, 1], [0, 96]);
  const birdY = useTransform(scrollYProgress, [0, 1], [0, -54]);
  const birdX = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // twelve rays around the sun, hidden until hover
  const rays = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);

  return (
    <div className="arch" aria-hidden ref={ref} tabIndex={0}>
      <svg viewBox="0 0 340 430" fill="none">
        <motion.g className="sun-group" style={reduce ? undefined : { y: sunY }}>
          {/* rays just outside the rim; unfurl from the sun center on hover */}
          <g className="sun-rays">
            {rays.map((a) => (
              <line
                key={a}
                x1="170"
                y1="126"
                x2="170"
                y2="74"
                stroke="var(--ochre)"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${a} 170 250)`}
              />
            ))}
          </g>
          {/* horizon stack of arcs, classic 70s sun */}
          <circle className="ring r-out" cx="170" cy="250" r="118" fill="var(--ochre)" opacity="0.92" />
          <circle className="ring r-mid" cx="170" cy="250" r="92" fill="var(--sand)" />
          <circle className="ring r-in" cx="170" cy="250" r="66" fill="var(--accent)" opacity="0.9" />
          <circle className="ring r-core" cx="170" cy="250" r="40" fill="var(--paper)" />
        </motion.g>
        {/* sea swell and foreground hill */}
        <path d="M-20 360 Q 90 300 200 356 T 380 350 V 440 H -20 Z" fill="var(--slate)" opacity="0.85" />
        <path d="M-20 392 Q 120 338 240 392 T 380 386 V 440 H -20 Z" fill="var(--ink)" opacity="0.88" />
        {/* thin flying birds: drifting on their own, lifting away on scroll */}
        <motion.g style={reduce ? undefined : { y: birdY, x: birdX }}>
          <g className="bird b1">
            <path d="M96 120 q 10 -9 20 0 q 10 -9 20 0" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" opacity="0.6" />
          </g>
          <g className="bird b2">
            <path d="M140 88 q 8 -7 16 0 q 8 -7 16 0" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          </g>
        </motion.g>
      </svg>
    </div>
  );
}
