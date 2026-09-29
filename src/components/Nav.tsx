import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { content } from '../content';
import { features } from '../features';
import { siteNav } from '../lib/siteNav';

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
  const lastY = useRef(0);
  const location = useLocation();

  // Real routes now (not in-page anchors) — "active" is whichever nav item's
  // path the current URL is under, not a scroll-spy. Simpler and more correct
  // once every section is its own page rather than a scroll stop on one long
  // page.
  const items = siteNav;
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

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

  // Close the drawer on route change (a Link navigation doesn't unmount Nav).
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

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
    <>
    <nav className={`nav${scrolled ? ' scrolled' : ''}${hidden && !open ? ' hidden' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <SunMark />
          <span className="nav-name">{content.profile.name}</span>
        </Link>

        {/* Desktop-only index (hidden ≤880px via CSS — the drawer covers phones). */}
        <div className="nav-index">
          {items.map((it) => (
            <Link key={it.path} to={it.path} className={`nav-item${isActive(it.path) ? ' is-active' : ''}`}>
              <span className="nav-label">{it.label}</span>
              {features.navWaves && (
                <span className="nav-wave" aria-hidden>
                  <svg viewBox="0 0 200 8" preserveAspectRatio="none" focusable="false">
                    <path d="M0 4 C 12.5 -2 37.5 10 50 4 C 62.5 -2 87.5 10 100 4 C 112.5 -2 137.5 10 150 4 C 162.5 -2 187.5 10 200 4" />
                  </svg>
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <Link to="/contact" className="nav-cta">{content.nav.cta}</Link>
          <button
            className={`nav-burger${open ? ' is-open' : ''}`}
            aria-label={open ? content.nav.close : content.nav.menu}
            aria-expanded={open}
            aria-controls="nav-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav-burger-lines" aria-hidden>
              <span /><span /><span />
            </span>
          </button>
        </div>
      </div>
    </nav>

    {/* Siblings of <nav>, not children: .nav gets backdrop-filter once scrolled,
        and a backdrop-filter ancestor creates a new containing block for a
        position:fixed descendant — that silently resized this drawer down to
        the nav bar's own height (a few hundred px) instead of the viewport
        the moment the page scrolled while it was open. */}
    <div
      className={`nav-scrim${open ? ' is-open' : ''}`}
      aria-hidden
      onClick={() => setOpen(false)}
    />
    <aside id="nav-drawer" className={`nav-drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <ul className="drawer-list">
        {items.map((it) => (
          <li key={it.path}>
            <Link
              to={it.path}
              className={`drawer-item${isActive(it.path) ? ' is-active' : ''}`}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              <span className="drawer-label">{it.label}</span>
              <svg className="drawer-arrow" viewBox="0 0 24 24" aria-hidden focusable="false">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/contact" className="drawer-cta" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
        {content.nav.cta}
      </Link>
    </aside>
    </>
  );
}
