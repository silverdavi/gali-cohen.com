// Registry of photos that have a generated cinemagraph loop in
// /public/clips/<name>.{webm,mp4}. Add a basename here once its clip is
// committed and any <Cinemagraph src="/photos/<name>.jpg"> upgrades to a
// living still automatically (subject to the photoMotion flag + reduced motion).
const AVAILABLE = new Set<string>([
  'portrait',
  'breath',
  'feet',
  'hands',
  'meditation',
  'bowl',
  'dance-circle',
]);

/** Map a photo path to its clip base (no extension), or undefined if none. */
export function clipFor(src?: string): string | undefined {
  if (!src) return undefined;
  const base = src.split('/').pop()?.replace(/\.(jpe?g|png|webp)$/i, '') ?? '';
  return AVAILABLE.has(base) ? `/clips/${base}` : undefined;
}
