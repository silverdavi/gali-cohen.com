import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { features } from '../features';

type Ring = { id: number; x: number; y: number };

// A soft ring blooms where you click or tap, echoing the breath ripples.
export function CursorRipple() {
  const reduce = useReducedMotion();
  const [rings, setRings] = useState<Ring[]>([]);

  useEffect(() => {
    if (!features.cursorRipple || reduce) return;
    let id = 0;
    const onDown = (e: PointerEvent) => {
      // ignore interactive targets so it never competes with buttons/links
      const t = e.target as HTMLElement;
      if (t.closest('a, button, input, textarea')) return;
      const ring = { id: id++, x: e.clientX, y: e.clientY };
      setRings((r) => [...r, ring]);
      window.setTimeout(() => {
        setRings((r) => r.filter((x) => x.id !== ring.id));
      }, 900);
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [reduce]);

  if (!features.cursorRipple || reduce) return null;

  return (
    <div className="ripple-layer" aria-hidden>
      {rings.map((r) => (
        <span className="cursor-ripple" key={r.id} style={{ left: r.x, top: r.y }} />
      ))}
    </div>
  );
}
