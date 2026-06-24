import { Reveal } from './Reveal';
import { HeroArch } from './HeroArch';
import { KineticText } from './KineticText';
import { content, lang } from '../content';

export function Hero() {
  const { profile, hero } = content;
  // The secondary name renders in the other script: Hebrew on the English
  // site, Latin on the Hebrew site.
  const altLang = lang === 'he' ? 'en' : 'he';
  const altDir = lang === 'he' ? 'ltr' : 'rtl';
  return (
    <header className="hero container" id="top">
      <div className="hero-grid">
        <div className="col-main">
          <Reveal>
            <p className="hero-kicker">{profile.kicker}</p>
          </Reveal>
          <KineticText as="h1" className="hero-name" text={profile.name} stagger={90} />
          <Reveal delay={0.14}>
            <p className="hero-hebrew" lang={altLang} dir={altDir}>{profile.hebrewName}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="hero-role">{profile.role}</p>
          </Reveal>
          <Reveal delay={0.26}>
            <p className="hero-lead">{profile.lead}</p>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="hero-ctas">
              <a className="btn btn-primary" href="#contact">{hero.ctaPrimary}</a>
              <a className="btn btn-ghost" href="#practices">{hero.ctaSecondary}</a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.2} y={28} className="col-side hero-art">
          <HeroArch />
        </Reveal>
      </div>
      {hero.scroll && <a className="hero-scroll" href="#breath">{hero.scroll}</a>}
    </header>
  );
}
