import { useEffect, useState } from 'react';
import { content } from '../content';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <a href="#top" className="nav-name">{content.profile.name}</a>
      <div className="nav-links">
        <a className="hide-sm" href="#practices">{content.nav.practices}</a>
        <a className="hide-sm" href="#circle">{content.nav.circles}</a>
        <a className="hide-sm" href="#about">{content.nav.about}</a>
        <a className="nav-cta" href="#contact">{content.nav.cta}</a>
      </div>
    </nav>
  );
}
