import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { content } from '../content';
import { features } from '../features';

// Full-bleed photo with a slow parallax drift: the image moves at a softer
// pace than the page, like looking out of a window.
export function Band() {
  const { band } = content;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);
  const parallax = features.bandParallax && !reduce;

  return (
    <section className="band" ref={ref}>
      <motion.img
        src={band.photo}
        alt={band.alt}
        loading="lazy"
        style={parallax ? { y, scale: 1.2 } : undefined}
      />
      <p className="band-caption">{band.caption}</p>
    </section>
  );
}
