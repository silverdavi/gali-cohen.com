import { content } from '../content';
import { features } from '../features';
import { Cinemagraph } from './Cinemagraph';
import { clipFor } from '../clips';

// The hero centerpiece: Gali's portrait in a rounded frame. Photo, alt text
// and focal point come from he.yaml (hero.photo / photoFocalX / photoFocalY).
export function HeroPortrait() {
  const { photo, photoAlt, photoFocalX, photoFocalY } = content.hero;
  const clip = clipFor(photo);

  return (
    <div className="hero-photo" role="img" aria-label={photoAlt}>
      <Cinemagraph
        className={`hero-photo-img${features.heroPhotoDrift && !(clip && features.photoMotion) ? ' drift' : ''}`}
        src={photo}
        clip={clip}
        style={{ objectPosition: `${photoFocalX}% ${photoFocalY}%` }}
        ariaHidden
        loading="eager"
        fetchPriority="high"
        sizes="(max-width: 880px) 220px, 308px"
      />
    </div>
  );
}
