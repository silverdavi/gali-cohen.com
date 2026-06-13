import { features } from '../features';

// Two ambient layers that live behind the content:
//  · a slow warm light field — three soft blobs of sun-coloured light drifting
//    on long, offset loops, so the page feels lit by moving daylight/water, not
//    printed on flat paper. Sits above the paper, below the text.
//  · a fine film grain over everything, for the tactile, premium feel of good
//    print. Static (cheap) and very low-contrast via soft-light blending.
// Both are decorative, pointer-transparent, and freeze under reduced-motion.
export function Ambient() {
  return (
    <>
      {features.ambientLight && (
        <div className="ambient" aria-hidden>
          <span className="ambient-blob b1" />
          <span className="ambient-blob b2" />
          <span className="ambient-blob b3" />
        </div>
      )}
      {features.grain && <div className="grain" aria-hidden />}
    </>
  );
}
