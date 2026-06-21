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
  'breath',
  'feet',
  'hands',
  'meditation',
  'dance-circle',
  'bowl',
]);

/** Map a photo path to its clip base (no extension), or undefined if none. */
export function clipFor(src?: string): string | undefined {
  if (!src) return undefined;
  const base = src.split('/').pop()?.replace(/\.(jpe?g|png|webp)$/i, '') ?? '';
  return AVAILABLE.has(base) ? `/clips/${base}` : undefined;
}
