import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SectionHead } from './SectionHead';
import { content } from '../content';

// Testimonials as a one-at-a-time slider: prev/next arrows, dots, and a gentle
// auto-advance that pauses on hover/focus and yields to reduced-motion.
// `items` defaults to every testimonial (used nowhere now, but keeps the
// component generically reusable) — the home page passes just the featured,
// limited subset.
export function Words({ items: itemsProp }: { items?: { quote: string; name: string }[] } = {}) {
  const { wordsSection } = content;
  const items = itemsProp ?? wordsSection.items;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  // Purely semantic: step is +1/-1 through the list, independent of reading
  // direction — only the arrow icons and their left/right position need to
  // account for RTL, not which way "next" moves through the array.
  const go = useCallback(
    (step: number) => setI((p) => (p + step + items.length) % items.length),
    [items.length],
  );

  useEffect(() => {
    if (paused || reduce || items.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [paused, reduce, items.length]);

  const startX = useRef<number | null>(null);
  if (items.length === 0) return null;
  const w = items[i];

  return (
    <section className="section words" id="words">
      <div className="container">
        <SectionHead label={wordsSection.label} />
        <div
          className="words-slider"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (startX.current == null) return;
            const dx = e.changedTouches[0].clientX - startX.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            startX.current = null;
          }}
        >
          <button
            className="words-arrow prev"
            aria-label="הקודם"
            onClick={() => go(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M9 5l7 7-7 7" /></svg>
          </button>

          <div className="words-stage">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={i}
                className="word"
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <span className="word-mark" aria-hidden>“</span>
                <blockquote>{w.quote}</blockquote>
                <figcaption>{w.name}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <button
            className="words-arrow next"
            aria-label="הבא"
            onClick={() => go(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
        </div>

        <div className="words-dots" role="tablist" aria-label={wordsSection.label}>
          {items.map((it, n) => (
            <button
              key={it.name + n}
              className={`words-dot${n === i ? ' is-active' : ''}`}
              aria-label={`${n + 1}`}
              aria-selected={n === i}
              role="tab"
              onClick={() => setI(n)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
