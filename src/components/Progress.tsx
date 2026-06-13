import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { dir } from '../content';
import { features } from '../features';

// A thin thread across the top of the page that fills as you scroll, with a
// small sun riding its leading edge: the day passing over the page.
export function Progress() {
  const { scrollYProgress } = useScroll();
  const eased = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  const scaleX = eased;
  // The sun travels with the edge of the thread; mirrored for RTL.
  const sunPos = useTransform(eased, (v) => `${v * 100}%`);

  return (
    <div className="progress-track" aria-hidden>
      <motion.div className="progress" style={{ scaleX }} />
      {features.progressSun && (
        <motion.div
          className="progress-sun"
          style={dir === 'rtl' ? { right: sunPos } : { left: sunPos }}
        />
      )}
    </div>
  );
}
