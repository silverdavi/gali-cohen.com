import { photoWidths } from './photoVariants';

/** srcSet for a content photo path. Unknown paths (external thumbs, a photo
 *  with only one size) pass through unchanged. */
export function photoSources(src: string): { src: string; srcSet?: string } {
  const widths = photoWidths[src];
  if (!widths || widths.length < 2) return { src };
  const full = widths[widths.length - 1];
  const parts = widths.slice(0, -1).map((w) => `${src.replace(/\.webp$/i, `-${w}.webp`)} ${w}w`);
  parts.push(`${src} ${full}w`);
  return { src, srcSet: parts.join(', ') };
}
