import { Reveal } from './Reveal';
import { ArchSun } from './ArchSun';
import { profile } from '../data/content';

export function Hero() {
  return (
    <header className="hero container" id="top">
      <div className="hero-grid">
        <div>
          <Reveal>
            <p className="hero-kicker">{profile.kicker}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="hero-name">Gali Geula Cohen</h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="hero-hebrew" lang="he" dir="rtl">{profile.hebrewName}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="hero-role">{profile.role}</p>
          </Reveal>
          <Reveal delay={0.26}>
            <p className="hero-lead">{profile.lead}</p>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="hero-ctas">
              <a className="btn btn-primary" href="#contact">Book a session</a>
              <a className="btn btn-ghost" href="#practices">What I offer</a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.2} y={28}>
          <ArchSun />
        </Reveal>
      </div>
      <a className="hero-scroll" href="#breath">Scroll</a>
    </header>
  );
}
