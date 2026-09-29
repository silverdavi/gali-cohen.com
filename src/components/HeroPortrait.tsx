import { content } from '../content';
import { features } from '../features';
import { Cinemagraph } from './Cinemagraph';
import { clipFor } from '../clips';

// The hero centerpiece: a real (typically cut-out, transparent-background)
// photograph sitting directly against the section's own sunset gradient — no
// arch frame, no sun-disc/ray-crown motif (both removed per Gali: the photo
// itself now carries the "sunset" feeling, not a graphic behind it). Photo,
// alt text and focal point are all CMS-editable (he.yaml's hero.photo /
// photoFocalX / photoFocalY) — nothing hardcoded here.
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
        fetchPriority="high"
      />
    </div>
  );
}
