import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { content } from '../content';
import { features } from '../features';

const RAYS = 12;

// The hero centerpiece: a real photograph framed in the site's arch motif, with
// a 70s sun rising behind it — a soft disc plus a radiating SVG ray crown. The
// crown spins slowly on its own, blooms when you hover the arch, and turns +
// sinks as you scroll past. All motion is flag-gated and yields to reduced motion.
export function HeroArch() {
  const alt = content.hero.photoAlt;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const rayRotate = useTransform(scrollYProgress, [0, 1], [0, 26]);
  const raySink = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const scrollTurn = features.scrollSunset && !reduce;

  return (
    <div
      className={`hero-photo${features.sunBloomHover ? ' can-bloom' : ''}`}
      role="img"
      aria-label={alt}
      ref={ref}
    >
      <span className={`hero-sun${features.heroSunRise ? ' rise' : ''}`} aria-hidden />
      {features.heroSunRays && (
        <motion.svg
          className="hero-rays"
          viewBox="0 0 200 200"
          aria-hidden
          focusable="false"
          style={scrollTurn ? { rotate: rayRotate, y: raySink } : undefined}
        >
          <g className="hero-rays-spin">
            <g className="hero-rays-bloom">
              {Array.from({ length: RAYS }, (_, i) => (
                <line
                  key={i}
                  className="hero-ray"
                  x1="100"
                  y1="26"
                  x2="100"
                  y2="3"
                  transform={`rotate(${(360 / RAYS) * i} 100 100)`}
                />
              ))}
            </g>
          </g>
        </motion.svg>
      )}
      <div className="hero-photo-frame">
        <img
          className={`hero-photo-img${features.heroPhotoDrift ? ' drift' : ''}`}
          src="/photos/portrait.jpg"
          alt=""
          aria-hidden
          fetchPriority="high"
        />
      </div>
    </div>
  );
}
