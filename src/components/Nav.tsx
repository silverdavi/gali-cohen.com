import { useEffect, useRef, useState } from 'react';
import { content } from '../content';
import { pricing, events, store } from '../content/collections';
import { features } from '../features';
import { moonPhase, moonLitPath } from '../lib/astro';

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

// A quiet quirk: a tiny moon in the bar drawn to tonight's *actual* phase
// (same math as the astrology section). It links down to that section, so the
// sun brand on one side and the live moon on the other bracket the bar.
function NavMoon() {
  const moon = moonPhase();
  const size = 22;
  const c = size / 2;
  const R = c - 1.5;
  const label = `${content.astro.moonLabel} · ${content.astro.moonPhases[moon.name]}`;
  return (
    <a className="nav-moon" href="#astro" aria-label={label} title={label}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden focusable="false">
        <circle className="nav-moon-disc" cx={c} cy={c} r={R} />
        <path className="nav-moon-lit" d={moonLitPath(R, moon.phase)} transform={`translate(${c} ${c})`} />
      </svg>
    </a>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>('');
  const lastY = useRef(0);

  // The page index: the same numbers appear in each section header. The
  // commerce sections only appear if their flag is on and they have content,
  // so the index always matches what's actually on the page.
  const items = [
    { id: 'practices', num: '01', label: content.nav.practices },
    { id: 'circle', num: '02', label: content.nav.circles },
    { id: 'about', num: '03', label: content.nav.about },
    ...(features.showPricing && pricing.items.length
      ? [{ id: 'pricing', num: '04', label: content.nav.pricing }]
      : []),
    ...(features.showEvents && events.items.length
      ? [{ id: 'events', num: '05', label: content.nav.events }]
      : []),
    ...(features.showStore && store.items.length
      ? [{ id: 'shop', num: '06', label: content.nav.shop }]
      : []),
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
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}${hidden ? ' hidden' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="nav-brand">
          <SunMark />
          <span className="nav-name">{content.profile.name}</span>
        </a>

        <div className="nav-index">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={`nav-item${active === it.id ? ' is-active' : ''}`}
            >
              <span className="nav-num">{it.num}</span>
              <span className="nav-label">{it.label}</span>
              {features.navWaves && (
                <span className="nav-wave" aria-hidden>
                  <svg viewBox="0 0 48 8" preserveAspectRatio="none" focusable="false">
                    <path d="M0 4 q 2 -2.6 4 0 t 4 0 t 4 0 t 4 0 t 4 0 t 4 0 t 4 0 t 4 0 t 4 0 t 4 0 t 4 0 t 4 0" />
                  </svg>
                </span>
              )}
            </a>
          ))}
        </div>

        <div className="nav-right">
          {features.astrology && <NavMoon />}
          <a className="nav-cta" href="#contact">{content.nav.cta}</a>
        </div>
      </div>
    </nav>
  );
}
