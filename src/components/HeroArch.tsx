import { content } from '../content';
import { features } from '../features';

// The hero centerpiece: a real photograph framed in the site's arch motif,
// with a 70s sun rising behind it and a slow Ken Burns drift on the image.
// Both motions are flag-gated and yield to prefers-reduced-motion in CSS.
export function HeroArch() {
  const alt = content.hero.photoAlt;
  return (
    <div className="hero-photo" role="img" aria-label={alt}>
      <span className={`hero-sun${features.heroSunRise ? ' rise' : ''}`} aria-hidden />
      <div className="hero-photo-frame">
        <img
          className={`hero-photo-img${features.heroPhotoDrift ? ' drift' : ''}`}
          src="/photos/portrait.jpg"
          alt=""
          aria-hidden
          fetchPriority="high"
        />
      </div>
    </div>
  );
}
