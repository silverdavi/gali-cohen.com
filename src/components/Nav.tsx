import { useEffect, useRef, useState } from 'react';
import { content } from '../content';
import { events, store, podcast, blog } from '../content/collections';
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
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const lastY = useRef(0);

  // The menu, in Gali's order. Sections that only render when they have content
  // are gated here too, so the menu never points at an empty section.
  const items = [
    { id: 'about', num: '01', label: content.nav.about },
    { id: 'practices', num: '02', label: content.nav.services },
    ...(features.showEvents && events.items.length ? [{ id: 'events', num: '03', label: content.nav.events }] : []),
    ...(content.wordsSection.items.length ? [{ id: 'words', num: '04', label: content.nav.words }] : []),
    ...(podcast.shows.length ? [{ id: 'podcast', num: '05', label: content.nav.podcast }] : []),
    ...(blog.items.length ? [{ id: 'blog', num: '06', label: content.nav.blog }] : []),
    { id: 'contact', num: '07', label: content.nav.contact },
    ...(features.showStore && store.items.length ? [{ id: 'shop', num: '08', label: content.nav.shop }] : []),
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

  // Scroll-spy for the brand-side active dot.
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

  // Lock body scroll + close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}${hidden && !open ? ' hidden' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="nav-brand" onClick={() => setOpen(false)}>
          <SunMark />
          <span className="nav-name">{content.profile.name}</span>
        </a>

        <button
          className={`nav-burger${open ? ' is-open' : ''}`}
          aria-label={open ? content.nav.close : content.nav.menu}
          aria-expanded={open}
          aria-controls="nav-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-burger-label">{open ? content.nav.close : content.nav.menu}</span>
          <span className="nav-burger-lines" aria-hidden>
            <span /><span /><span />
          </span>
        </button>
      </div>

      <div
        className={`nav-scrim${open ? ' is-open' : ''}`}
        aria-hidden
        onClick={() => setOpen(false)}
      />
      <aside id="nav-drawer" className={`nav-drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <ul className="drawer-list">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={`drawer-item${active === it.id ? ' is-active' : ''}`}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
              >
                <span className="drawer-num">{it.num}</span>
                <span className="drawer-label">{it.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="drawer-cta" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
          {content.nav.cta}
        </a>
      </aside>
    </nav>
  );
}
