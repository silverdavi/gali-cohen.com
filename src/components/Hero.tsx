import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { HeroPortrait } from './HeroPortrait';
import { KineticText } from './KineticText';
import { content } from '../content';

// Trimmed to what a visitor needs in a few seconds: who she is, who it's for,
// what she offers, where to go next — the old kicker/romanized-name/role/lead
// stack duplicated the same identity three times over. The fuller bio moved
// to /about.
//
// Structure: <header class="hero"> carries the full-viewport-width background
// (glows, gradients); everything else sits inside the constrained/centered
// .hero-container. Column order (portrait right, copy left) is set explicitly
// in CSS via .hero-container's own `direction: ltr` (see index.css) rather
// than left to RTL's natural column-reversal — the DOM order below (copy
// first, portrait second) is the reading/tab order and is intentionally NOT
// the same as the visual left-to-right order.
export function Hero() {
  const { profile, hero } = content;
  return (
    <header className="hero" id="top">
      <div className="hero-container">
        <div className="hero-copy">
          <KineticText as="h1" className="hero-name" text={profile.name} stagger={90} />
          <Reveal delay={0.12}>
            <p className="hero-tagline">{hero.tagline}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="hero-audience">{hero.audienceLine}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="hero-values">{hero.valuesLine}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="hero-ctas">
              <Link className="btn btn-primary" to="/services">{hero.ctaPrimary}</Link>
              <Link className="btn btn-ghost" to="/about">{hero.ctaSecondary}</Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.16} y={28} className="hero-portrait-col">
          <HeroPortrait />
        </Reveal>
      </div>
      {hero.scroll && <a className="hero-scroll" href="#services">{hero.scroll}</a>}
    </header>
  );
}
