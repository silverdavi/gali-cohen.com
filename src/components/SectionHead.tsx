import { Reveal } from './Reveal';
import { KineticText } from './KineticText';

type Props = {
  /** zero-padded section number, e.g. "01". Omit for unnumbered moments. */
  index?: string;
  label: string;
  title?: string;
  sub?: string;
};

// The one header used by every section, so the eyebrow / title / standfirst
// rhythm is identical everywhere by construction (not re-typed per section).
// The index number ties each section to its entry in the nav index. The title
// is kinetic (word-by-word rise) so the eye lands on it as the section opens.
export function SectionHead({ index, label, title, sub }: Props) {
  return (
    <header className="section-head">
      <Reveal>
        <p className="section-label">
          {index && <span className="section-index">{index}</span>}
          {index && <span className="section-rule" aria-hidden />}
          <span className="section-label-text">{label}</span>
        </p>
      </Reveal>
      {title && <KineticText as="h2" className="section-title" text={title} />}
      {sub && (
        <Reveal delay={0.12}>
          <p className="section-sub">{sub}</p>
        </Reveal>
      )}
    </header>
  );
}
