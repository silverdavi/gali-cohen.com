import { Reveal } from './Reveal';
import { content } from '../content';

const FIGURES = 9;

// One dancing figure: head + open-armed body, drawn pointing outward from center.
function Figure({ angle }: { angle: number }) {
  return (
    <g transform={`rotate(${angle} 140 140) translate(140 38)`}>
      <circle cx="0" cy="0" r="7" fill="#C05A2E" />
      {/* body */}
      <path d="M0 7 V 34" stroke="#2A1F14" strokeWidth="3.4" strokeLinecap="round" />
      {/* arms raised toward neighbors */}
      <path d="M0 14 Q -12 8 -19 -1" stroke="#2A1F14" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M0 14 Q 12 8 19 -1" stroke="#2A1F14" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* legs mid-step */}
      <path d="M0 34 Q -7 44 -10 52" stroke="#2A1F14" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M0 34 Q 8 43 9 52" stroke="#2A1F14" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}

export function Circle() {
  const { circle } = content;
  return (
    <section className="section" id="circle">
      <div className="container">
        <Reveal>
          <p className="section-label">{circle.label}</p>
          <h2 className="section-title">{circle.title}</h2>
        </Reveal>
        <div className="circle-grid">
          <Reveal y={28}>
            <div>
              <svg className="dance" viewBox="0 0 280 280" role="img" aria-label={circle.alt}>
                <circle cx="140" cy="140" r="64" fill="none" stroke="#E8DFCB" strokeWidth="1.5" strokeDasharray="3 7" />
                <g className="turning">
                  {Array.from({ length: FIGURES }, (_, i) => (
                    <Figure key={i} angle={(360 / FIGURES) * i} />
                  ))}
                </g>
                <circle cx="140" cy="140" r="5" fill="#D9A441" />
              </svg>
              <p className="circle-caption">{circle.caption}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="section-sub">{circle.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
