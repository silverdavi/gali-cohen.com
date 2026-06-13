import { Reveal } from './Reveal';

type Props = {
  /** zero-padded section number, e.g. "01". Omit for unnumbered moments. */
  index?: string;
  label: string;
  title?: string;
  sub?: string;
};

// The one header used by every section, so the eyebrow / title / standfirst
// rhythm is identical everywhere by construction (not re-typed per section).
// The index number ties each section to its entry in the nav index.
export function SectionHead({ index, label, title, sub }: Props) {
  return (
    <Reveal>
      <header className="section-head">
        <p className="section-label">
          {index && <span className="section-index">{index}</span>}
          {index && <span className="section-rule" aria-hidden />}
          <span className="section-label-text">{label}</span>
        </p>
        {title && <h2 className="section-title">{title}</h2>}
        {sub && <p className="section-sub">{sub}</p>}
      </header>
    </Reveal>
  );
}
