import { Reveal } from './Reveal';
import { KineticText } from './KineticText';

type Props = {
  label: string;
  title?: string;
  sub?: string;
  /** h1 on a standalone page whose main title this is; h2 (default) when
      embedded as one of several sections on a page that already has its own
      h1 elsewhere (Home's h1 is the hero name; AboutPage's h1 is its first
      SectionHead, so its second — Story — stays h2). */
  as?: 'h1' | 'h2';
};

// The one header used by every section. `label` (the small eyebrow above the
// title) is accepted but deliberately not rendered — removed sitewide per
// Gali. The title is kinetic (word-by-word rise) so the eye lands on it as
// the section opens.
export function SectionHead({ title, sub, as = 'h2' }: Props) {
  return (
    <header className="section-head">
      {title && <KineticText as={as} className="section-title" text={title} />}
      {sub && (
        <Reveal delay={0.12}>
          <p className="section-sub">{sub}</p>
        </Reveal>
      )}
    </header>
  );
}
