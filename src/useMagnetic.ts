import { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { features } from './features';

// Returns props for an element that drifts a few pixels toward the cursor while
// hovered, then springs back. Gated by the magneticCta flag and reduced-motion.
export function useMagnetic(strength = 0.25, max = 10) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const enabled = features.magneticCta && !reduce;

  const onMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const clamp = (v: number) => Math.max(-max, Math.min(max, v * strength));
    ref.current.style.transform = `translate(${clamp(dx)}px, ${clamp(dy)}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return enabled ? { ref, onMouseMove: onMove, onMouseLeave: onLeave } : {};
}
