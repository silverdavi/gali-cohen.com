import { useEffect, useState } from 'react';
import { profile } from '../data/content';

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
      <a href="#top" className="nav-name">{profile.name}</a>
      <div className="nav-links">
        <a className="hide-sm" href="#practices">Practices</a>
        <a className="hide-sm" href="#circle">Circles</a>
        <a className="hide-sm" href="#about">About</a>
        <a className="nav-cta" href="#contact">Say hello</a>
      </div>
    </nav>
  );
}
