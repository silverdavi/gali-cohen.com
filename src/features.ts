// Dynamic-behavior switches. Flip any to false to disable that motion entirely;
// the component falls back to a calm static state. prefers-reduced-motion is
// always honored on top of these regardless of the flag.
//
// Override per-visit without editing code by adding query params, e.g.
//   ?calm           -> disables every dynamic flag (a quiet kill switch)
//   ?ff=cursorRipple:0,timeOfDaySun:0   -> turn specific flags off
//   ?ff=magneticCta:1                   -> force one on

export type FeatureKey =
  | 'scrollSunset'      // hero sun sets behind the swell as you scroll past
  | 'pointerTiltArch'   // arch tilts slightly toward the cursor
  | 'sunBloomHover'     // sun ray-crown unfurls on arch hover/focus
  | 'progressSun'       // a small sun rides the scroll-progress thread
  | 'breathStage'       // the breathing circle animates (vs. a still sun)
  | 'danceScrollTurn'   // the dance circle turns as you scroll through it
  | 'danceJoinHover'    // a tenth dancer joins the ring on hover
  | 'bandParallax'      // the photo band drifts at a softer pace
  | 'swayReveal'        // practice rows reveal from alternating sides
  | 'quoteLift'         // quote cards lift on hover
  | 'medallionSpin'     // the contact bowl rotates
  | 'magneticCta'       // the primary contact button drifts toward the cursor
  | 'cursorRipple'      // a soft ripple blooms where you click/tap
  | 'timeOfDaySun';     // hero warmth shifts with the visitor's local clock

const DEFAULTS: Record<FeatureKey, boolean> = {
  scrollSunset: true,
  pointerTiltArch: true,
  sunBloomHover: true,
  progressSun: true,
  breathStage: true,
  danceScrollTurn: true,
  danceJoinHover: true,
  bandParallax: true,
  swayReveal: true,
  quoteLift: true,
  medallionSpin: true,
  magneticCta: true,
  cursorRipple: true,
  timeOfDaySun: true,
};

function resolve(): Record<FeatureKey, boolean> {
  const flags = { ...DEFAULTS };
  if (typeof window === 'undefined') return flags;
  const params = new URLSearchParams(window.location.search);
  if (params.has('calm')) {
    (Object.keys(flags) as FeatureKey[]).forEach((k) => (flags[k] = false));
  }
  const ff = params.get('ff');
  if (ff) {
    ff.split(',').forEach((pair) => {
      const [key, val] = pair.split(':');
      if (key in flags) flags[key as FeatureKey] = val !== '0' && val !== 'false';
    });
  }
  return flags;
}

export const features = resolve();
