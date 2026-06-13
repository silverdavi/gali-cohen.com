import { useEffect, useRef, useState } from 'react';
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
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 32);
      if (features.navHideOnScroll) {
        // hide when scrolling down past the hero, reveal on any upward move
        const goingDown = y > lastY.current && y > window.innerHeight * 0.9;
        setHidden(goingDown);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}${hidden ? ' hidden' : ''}`}>
      <a href="#top" className="nav-brand">
        <SunMark />
        <span className="nav-name">{content.profile.name}</span>
      </a>
      <div className="nav-links">
        <a className="hide-sm" href="#practices">{content.nav.practices}</a>
        <a className="hide-sm" href="#circle">{content.nav.circles}</a>
        <a className="hide-sm" href="#about">{content.nav.about}</a>
        <a className="nav-cta" href="#contact">{content.nav.cta}</a>
      </div>
    </nav>
  );
}
