import { useEffect, useRef } from 'react';
import type { ElementType, ReactNode } from 'react';
import { features } from '../features';

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** ms between each word's rise */
  stagger?: number;
};

// Word-by-word "rise from a mask" reveal for headings. Each word sits in an
// overflow-clipped box and lifts into view on a stagger when scrolled into
// view — kinetic typography that still wraps and reflows like normal text
// (words are inline-block, separated by real spaces). Falls back to plain text
// when the flag is off, and to fully-visible words under reduced-motion.
export function KineticText({ text, as, className, stagger = 58 }: Props) {
  const Tag = (as ?? 'span') as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!features.kineticType) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('kin-in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('kin-in');
            io.disconnect();
          }
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!features.kineticType) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(' ');
  const nodes: ReactNode[] = [];
  words.forEach((w, i) => {
    if (i > 0) nodes.push(' ');
    nodes.push(
      <span
        className="kin-w"
        key={i}
        aria-hidden="true"
        style={{ ['--ki' as string]: i, ['--kstep' as string]: `${stagger}ms` }}
      >
        <span className="kin-wi">{w}</span>
      </span>,
    );
  });
  return (
    <Tag ref={ref} className={`${className ?? ''} kin`.trim()} aria-label={text}>
      {nodes}
    </Tag>
  );
}
