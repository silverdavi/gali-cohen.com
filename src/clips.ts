// Registry of photos that have a generated cinemagraph loop in
// /public/clips/<name>.{webm,mp4}. Add a basename here once its clip is
// committed and any <Cinemagraph src="/photos/<name>.jpg"> upgrades to a
// living still automatically (subject to the photoMotion flag + reduced motion).
// Loops regenerated from Gali's real photos (SVD on HF Jobs, then
// tools/cinemagraph_encode.sh blends the motion over the frozen still at low
// opacity + ping-pong). Each name has /public/clips/<name>.{webm,mp4,jpg}.
const AVAILABLE = new Set<string>([
  // 'portrait' intentionally omitted — the hero is now a headshot; a face that
  // subtly drifts reads as uncanny, so it stays a clean still.
  // 'dance-circle' intentionally omitted — the source photo is 2000x1125, but
  // the generated loop (and its poster) is only 1024x576. Stretched full-bleed
  // across the band and scaled 1.2x for the parallax, that reads as blurry;
  // several people's limbs also drift more noticeably than a single portrait
  // does, so it stays a clean, crisp still instead.
  'breath',
  'feet',
  'hands',
  'meditation',
  'bowl',
]);

/** Map a photo path to its clip base (no extension), or undefined if none. */
export function clipFor(src?: string): string | undefined {
  if (!src) return undefined;
  const base = src.split('/').pop()?.replace(/\.(jpe?g|png|webp)$/i, '') ?? '';
  return AVAILABLE.has(base) ? `/clips/${base}` : undefined;
}
