// Dynamic-behavior switches. Flip any to false to disable that motion entirely;
// the component falls back to a calm static state. prefers-reduced-motion is
// always honored on top of these regardless of the flag.
//
// Override per-visit without editing code by adding query params, e.g.
//   ?calm           -> disables every dynamic flag (a quiet kill switch)
//   ?ff=cursorRipple:0,timeOfDaySun:0   -> turn specific flags off
//   ?ff=magneticCta:1                   -> force one on

export type FeatureKey =
  | 'kineticType'       // headings rise word-by-word from a mask when revealed
  | 'navWaves'          // nav hover/active underline is a flowing wave (sun over the sea)
  | 'heroSunRays'       // an SVG ray crown radiates behind the hero arch (idle spin + scroll turn)
  | 'photoHover'        // photographs warm and lift on hover (develop effect)
  | 'figureSway'        // the dance figures sway gently in place
  | 'ambientLight'      // slow warm light field drifting behind the page
  | 'grain'             // fine film grain over everything (premium texture)
  | 'heroPhotoDrift'    // hero photo slowly drifts/zooms (Ken Burns)
  | 'heroSunRise'       // the sun behind the hero arch breathes
  | 'navHideOnScroll'   // nav hides on scroll-down, returns on scroll-up
  | 'scrollSunset'      // hero sun sets behind the swell as you scroll past
  | 'pointerTiltArch'   // arch tilts slightly toward the cursor
  | 'sunBloomHover'     // sun ray-crown unfurls on arch hover/focus
  | 'progressSun'       // a small sun rides the scroll-progress thread
  | 'breathStage'       // the breathing circle animates (vs. a still sun)
  | 'breathGuide'       // a progress arc traces the breath cycle (draw on inhale, drain on exhale)
  | 'breathScrollReveal'// the breath stage eases in (scale + fade) as the section centers
  | 'breathDark'        // the breath section sinks into a deep moss night
  | 'breathOrganicEdge' // dark breath dissolves into the paper via a grainy, undulating veil
  | 'danceScrollTurn'   // the dance circle turns as you scroll through it
  | 'danceJoinHover'    // a tenth dancer joins the ring on hover
  | 'bandParallax'      // the photo band drifts at a softer pace
  | 'swayReveal'        // practice rows reveal from alternating sides
  | 'quoteLift'         // quote cards lift on hover
  | 'medallionSpin'     // the contact bowl rotates
  | 'magneticCta'       // the primary contact button drifts toward the cursor
  | 'cursorRipple'      // a soft ripple blooms where you click/tap
  | 'timeOfDaySun'      // hero warmth shifts with the visitor's local clock
  | 'showPricing'       // render the CMS-managed pricing section
  | 'showEvents'        // render the CMS-managed upcoming-events section
  | 'showStore';        // render the CMS-managed shop section

const DEFAULTS: Record<FeatureKey, boolean> = {
  kineticType: true,
  navWaves: true,
  heroSunRays: true,
  photoHover: true,
  figureSway: true,
  ambientLight: true,
  grain: true,
  heroPhotoDrift: true,
  heroSunRise: true,
  navHideOnScroll: true,
  scrollSunset: true,
  pointerTiltArch: true,
  sunBloomHover: true,
  progressSun: true,
  breathStage: true,
  breathGuide: true,
  breathScrollReveal: true,
  breathDark: true,
  breathOrganicEdge: true,
  danceScrollTurn: true,
  danceJoinHover: true,
  bandParallax: true,
  swayReveal: true,
  quoteLift: true,
  medallionSpin: true,
  magneticCta: true,
  cursorRipple: true,
  timeOfDaySun: true,
  showPricing: true,
  showEvents: true,
  showStore: true,
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
