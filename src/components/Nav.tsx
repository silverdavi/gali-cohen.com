import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { content } from '../content';
import { features } from '../features';

// A small concentric-ring sun, the site's motif shrunk to a brand glyph.
function SunMark() {
  return (
    <svg className="nav-sun" viewBox="0 0 32 32" aria-hidden focusable="false">
      <circle cx="16" cy="16" r="14" fill="var(--ochre)" opacity="0.92" />
      <circle cx="16" cy="16" r="10" fill="var(--sand)" />
      <circle cx="16" cy="16" r="6" fill="var(--accent)" opacity="0.9" />
      <circle cx="16" cy="16" r="3" fill="var(--paper)" />
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>('');
  const [marker, setMarker] = useState<{ x: number; w: number } | null>(null);
  const [resizeTick, setResizeTick] = useState(0);
  const lastY = useRef(0);
  const indexRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // The page index: the same numbers appear in each section header.
  const items = [
    { id: 'practices', num: '01', label: content.nav.practices },
    { id: 'circle', num: '02', label: content.nav.circles },
    { id: 'about', num: '03', label: content.nav.about },
  ];

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 32);
      if (features.navHideOnScroll) {
        const goingDown = y > lastY.current && y > window.innerHeight * 0.9;
        setHidden(goingDown);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: the section whose midpoint sits nearest the upper third of the
  // viewport is "active". A line, not a band, so exactly one wins at a time.
  useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let current = '';
      for (const sec of sections) {
        const r = sec.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) current = sec.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const onResize = () => setResizeTick((t) => t + 1);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Slide the sun marker under the active item (RTL-safe: offsets are physical).
  useLayoutEffect(() => {
    const wrap = indexRef.current;
    const el = active ? itemRefs.current[active] : null;
    if (!wrap || !el) {
      setMarker(null);
      return;
    }
    const wr = wrap.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    setMarker({ x: er.left - wr.left + er.width / 2, w: er.width });
  }, [active, scrolled, resizeTick]);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}${hidden ? ' hidden' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="nav-brand">
          <SunMark />
          <span className="nav-name">{content.profile.name}</span>
        </a>

        <div className="nav-index" ref={indexRef}>
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              ref={(el) => { itemRefs.current[it.id] = el; }}
              className={`nav-item${active === it.id ? ' is-active' : ''}`}
            >
              <span className="nav-num">{it.num}</span>
              <span className="nav-label">{it.label}</span>
            </a>
          ))}
          {marker && (
            <span
              className="nav-marker"
              style={{ transform: `translateX(${marker.x}px)`, opacity: 1 }}
              aria-hidden
            >
              <svg className="nav-sun-mark" viewBox="0 0 24 24" focusable="false">
                <g className="nav-sun-rays">
                  <line x1="12" y1="1.5" x2="12" y2="4.5" />
                  <line x1="12" y1="19.5" x2="12" y2="22.5" />
                  <line x1="1.5" y1="12" x2="4.5" y2="12" />
                  <line x1="19.5" y1="12" x2="22.5" y2="12" />
                  <line x1="4.6" y1="4.6" x2="6.7" y2="6.7" />
                  <line x1="17.3" y1="17.3" x2="19.4" y2="19.4" />
                  <line x1="17.3" y1="6.7" x2="19.4" y2="4.6" />
                  <line x1="4.6" y1="19.4" x2="6.7" y2="17.3" />
                </g>
                <circle className="nav-sun-disc" cx="12" cy="12" r="4" />
              </svg>
            </span>
          )}
        </div>

        <a className="nav-cta" href="#contact">{content.nav.cta}</a>
      </div>
    </nav>
  );
}
