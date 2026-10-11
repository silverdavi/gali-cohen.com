import { content } from '../content';

export type SectionKey = 'blog' | 'podcast' | 'videos' | 'store';

/** False hides the section from the nav, footer, homepage, sitemap, and its
 *  own URL. The YAML content is left in place. Flip `sections.<key>.enabled`
 *  back to true in src/content/he.yaml to restore it. */
export function sectionEnabled(key: SectionKey): boolean {
  return content.sections[key].enabled;
}
