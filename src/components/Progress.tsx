import { motion, useScroll, useSpring } from 'framer-motion';

export function Progress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  return <motion.div className="progress" style={{ scaleX }} aria-hidden />;
}
