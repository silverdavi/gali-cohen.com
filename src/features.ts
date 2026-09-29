// Dynamic-behavior switches. Flip any to false to disable that motion entirely;
// the component falls back to a calm static state. prefers-reduced-motion is
// always honored on top of these regardless of the flag.
//
// Override per-visit without editing code by adding query params, e.g.
//   ?calm           -> disables every dynamic flag (a quiet kill switch)
//   ?ff=cursorRipple:0,grain:0          -> turn specific flags off
//   ?ff=magneticCta:1                   -> force one on

export type FeatureKey =
  | 'kineticType'       // headings rise word-by-word from a mask when revealed
  | 'navWaves'          // nav hover/active underline is a flowing wave (sun over the sea)
  | 'photoHover'        // photographs warm and lift on hover (develop effect)
  | 'photoMotion'       // photos become "living stills": a subtle muted loop plays in view (cinemagraph)
  | 'figureSway'        // the dance figures sway gently in place
  | 'astrology'         // render the celestial "sky right now" + find-your-sign section
  | 'astroMotion'       // constellations draw themselves in + stars twinkle
  | 'zodiacMedallions'  // show the quirky flat zodiac roundels (vs. gold line-art constellations)
  | 'ambientLight'      // slow warm light field drifting behind the page
  | 'grain'             // fine film grain over everything (premium texture)
  | 'heroPhotoDrift'    // hero photo slowly drifts/zooms (Ken Burns)
  | 'navHideOnScroll'   // nav hides on scroll-down, returns on scroll-up
  | 'progressSun'       // a small sun rides the scroll-progress thread
  | 'danceScrollTurn'   // the dance circle turns as you scroll through it
  | 'danceJoinHover'    // a tenth dancer joins the ring on hover
  | 'bandParallax'      // the photo band drifts at a softer pace
  | 'swayReveal'        // practice rows reveal from alternating sides
  | 'quoteLift'         // quote cards lift on hover
  | 'medallionSpin'     // the contact bowl rotates
  | 'magneticCta'       // the primary contact button drifts toward the cursor
  | 'cursorRipple'      // a soft ripple blooms where you click/tap
  | 'showStore'         // render the CMS-managed shop section
  | 'showStory';        // render the personal-story / lecture section ("גוף, אמונה וגאולה")

const DEFAULTS: Record<FeatureKey, boolean> = {
  kineticType: true,
  navWaves: true,
  photoHover: true,
  photoMotion: true,
  figureSway: true,
  astrology: false, // removed per Gali — no celestial section or nav moon
  astroMotion: false,
  zodiacMedallions: false,
  ambientLight: true,
  grain: true,
  heroPhotoDrift: true,
  navHideOnScroll: true,
  progressSun: true,
  danceScrollTurn: true,
  danceJoinHover: true,
  bandParallax: true,
  swayReveal: true,
  quoteLift: true,
  medallionSpin: false, // off for the real session photo — a slow-spinning person reads oddly
  magneticCta: true,
  cursorRipple: true,
  showStore: true,
  showStory: true,
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
