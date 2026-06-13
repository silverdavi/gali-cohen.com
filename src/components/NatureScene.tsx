import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// A quiet, living nature layer: every so often a small bird flies in along a
// gentle arc, a slender branch reaches out from the nearest edge to receive it,
// the bird perches and breathes, then the branch recedes and the bird lifts off
// and leaves. One bird at a time — presence, not a flock. Purely decorative
// (pointer-transparent, aria-hidden) and fully disabled under reduced motion.

type Side = 'left' | 'right';
type Phase = 'in' | 'perch' | 'out';
type Visit = {
  id: number;
  side: Side;
  perchX: number; perchY: number;
  startX: number; startY: number;
  midX: number; midY: number;
  exitX: number; exitY: number;
  exitMidX: number; exitMidY: number;
  branchLen: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

// Test/debug affordance: ?birdfast brings birds in quickly and back-to-back so
// the choreography can be inspected. No effect on the normal, calm cadence.
const FAST = typeof window !== 'undefined' && window.location.search.includes('birdfast');

function makeVisit(id: number): Visit {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const side: Side = FAST ? 'left' : Math.random() < 0.5 ? 'left' : 'right';
  const perchX = FAST ? 0.3 * W : side === 'left' ? rand(0.13, 0.24) * W : rand(0.76, 0.87) * W;
  const perchY = FAST ? 0.42 * H : rand(0.3, 0.62) * H;
  const fromBelow = Math.random() < 0.5;
  const startX = side === 'left' ? -80 : W + 80;
  const startY = perchY + (fromBelow ? rand(70, 180) : rand(-180, -70));
  const midX = side === 'left' ? perchX * 0.5 : (W + perchX) / 2;
  const midY = (startY + perchY) / 2 - rand(40, 100);
  const exitX = side === 'left' ? -100 : W + 100;
  const exitY = perchY - rand(170, 320);
  const exitMidX = (perchX + exitX) / 2;
  const exitMidY = perchY - rand(50, 110);
  const branchLen = side === 'left' ? perchX + 10 : W - perchX + 10;
  return { id, side, perchX, perchY, startX, startY, midX, midY, exitX, exitY, exitMidX, exitMidY, branchLen };
}

const BIRD_W = 44;
const BIRD_H = 30;

function Bird({ visit, onDone }: { visit: Visit; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('in');

  // hold on the branch, then leave
  useEffect(() => {
    if (phase !== 'perch') return;
    const t = setTimeout(() => setPhase('out'), rand(3800, 6500));
    return () => clearTimeout(t);
  }, [phase]);

  const flying = phase === 'in' || phase === 'out';
  // face the direction of travel; when perched, look into the page
  const faceLeft =
    phase === 'in' ? visit.perchX < visit.startX
    : phase === 'out' ? visit.exitX < visit.perchX
    : visit.side === 'right';

  const target =
    phase === 'in' ? { x: [visit.startX, visit.midX, visit.perchX], y: [visit.startY, visit.midY, visit.perchY], opacity: [0, 0.92, 0.92] }
    : phase === 'out' ? { x: [visit.perchX, visit.exitMidX, visit.exitX], y: [visit.perchY, visit.exitMidY, visit.exitY], opacity: [0.92, 0.92, 0] }
    : { x: visit.perchX, y: visit.perchY, opacity: 0.92 };

  const transition =
    phase === 'in' ? { duration: 3.4, ease: [0.42, 0, 0.3, 1] as const }
    : phase === 'out' ? { duration: 2.7, ease: [0.5, 0, 0.85, 0.6] as const }
    : { duration: 0 };

  const branchTop = visit.perchY + BIRD_H / 2 - 14;
  const L = visit.branchLen;
  const BH = 40; // branch box height; the stem sags within it
  // stem y along the branch (a gentle downward sag, root higher than tip-ish)
  const stemY = (t: number) => 10 + Math.sin(t * Math.PI) * 6; // t in [0,1]
  const leafAt = [0.46, 0.68, 0.9];

  return (
    <>
      {/* the branch reaches out from the edge to meet the bird, then recedes */}
      <div
        className={`nature-branch ${visit.side}${phase === 'perch' ? ' out' : ''}`}
        style={{ top: branchTop, width: L, height: BH }}
      >
        <svg viewBox={`0 0 ${L} ${BH}`} width={L} height={BH} preserveAspectRatio="none">
          {/* woody main stem, sagging slightly under its own length */}
          <path
            className="nature-twig stem"
            d={`M0 ${stemY(0)} C ${L * 0.33} ${stemY(0.33) - 3}, ${L * 0.66} ${stemY(0.66) + 2}, ${L} ${stemY(1)}`}
            fill="none"
          />
          {leafAt.map((t, i) => {
            const x = L * t;
            const y = stemY(t);
            const up = i % 2 === 0;
            return (
              <g key={i} transform={`translate(${x} ${y})`}>
                <path className="nature-twig sprig" d={up ? 'M0 0 q 6 -7 13 -9' : 'M0 0 q 6 7 13 9'} fill="none" />
                <path
                  className="nature-leaf"
                  d={up ? 'M9 -7 q 9 -5 16 0 q -7 7 -16 0 Z' : 'M9 7 q 9 5 16 0 q -7 -7 -16 0 Z'}
                />
                <path
                  className="nature-leaf"
                  d={up ? 'M13 -9 q 4 -8 11 -9 q 1 9 -5 13 Z' : 'M13 9 q 4 8 11 9 q 1 -9 -5 -13 Z'}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* the bird itself — framer drives its flight; CSS handles wings + bob */}
      <motion.div
        className="nature-bird"
        initial={{ x: visit.startX, y: visit.startY, opacity: 0 }}
        animate={target}
        transition={transition}
        onAnimationComplete={() => {
          if (phase === 'in') setPhase('perch');
          else if (phase === 'out') onDone();
        }}
      >
        <div className={`nature-bird-bob ${phase}`}>
          <svg
            className={`nature-bird-svg ${flying ? 'flying' : 'perched'}${faceLeft ? ' face-left' : ''}`}
            viewBox="0 0 44 30"
            width={BIRD_W}
            height={BIRD_H}
            aria-hidden
          >
            {/* tail */}
            <path className="nb-fill" d="M10 16 L1 11 L4 17 L1 23 Z" />
            {/* body + head + beak */}
            <ellipse className="nb-fill" cx="21" cy="16" rx="11" ry="6.4" />
            <circle className="nb-fill" cx="32" cy="11" r="4.6" />
            <path className="nb-beak" d="M36 10.5 L42 12 L36 13.5 Z" />
            {/* legs — only meaningful when perched */}
            <g className="nb-legs">
              <line x1="19" y1="22" x2="19" y2="27" />
              <line x1="25" y1="22" x2="25" y2="27" />
            </g>
            {/* wing flaps in flight, folds at rest */}
            <path className="nb-wing nb-fill" d="M19 12 q 7 -10 15 -3 q -7 6 -15 3 Z" />
          </svg>
        </div>
      </motion.div>
    </>
  );
}

export function NatureScene() {
  const reduce = useReducedMotion();
  const [visit, setVisit] = useState<Visit | null>(null);
  const idRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const schedule = useCallback((delay: number) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (document.hidden) {
        schedule(4000); // wait until the tab is visible again
        return;
      }
      setVisit(makeVisit(++idRef.current));
    }, delay);
  }, []);

  useEffect(() => {
    if (reduce) return;
    schedule(FAST ? 400 : rand(3500, 7000));
    return () => clearTimeout(timerRef.current);
  }, [reduce, schedule]);

  const handleDone = useCallback(() => {
    setVisit(null);
    schedule(FAST ? 1200 : rand(11000, 24000));
  }, [schedule]);

  if (reduce || !visit) return null;

  return (
    <div className="nature" aria-hidden>
      <Bird key={visit.id} visit={visit} onDone={handleDone} />
    </div>
  );
}
