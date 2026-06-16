// Registry of photos that have a generated cinemagraph loop in
// /public/clips/<name>.{webm,mp4}. Add a basename here once its clip is
// committed and any <Cinemagraph src="/photos/<name>.jpg"> upgrades to a
// living still automatically (subject to the photoMotion flag + reduced motion).
// NOTE: emptied when the AI placeholder photos were replaced with Gali's real
// photos — the previously generated loops were keyed to the old stills and would
// swap to the wrong image on hover. Regenerate cinemagraphs from the real photos
// (tools/cinemagraph_svd.py + tools/cinemagraph_encode.sh) and re-add basenames
// here to upgrade them back to living stills.
const AVAILABLE = new Set<string>([]);

/** Map a photo path to its clip base (no extension), or undefined if none. */
export function clipFor(src?: string): string | undefined {
  if (!src) return undefined;
  const base = src.split('/').pop()?.replace(/\.(jpe?g|png|webp)$/i, '') ?? '';
  return AVAILABLE.has(base) ? `/clips/${base}` : undefined;
}
