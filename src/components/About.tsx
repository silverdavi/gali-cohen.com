import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { Cinemagraph } from './Cinemagraph';
import { content } from '../content';
import { clipFor } from '../clips';

// Home teaser only — photo + 2–3 short paragraphs + a CTA onward. The full
// story/training/approach (and the personal-story lecture content) lives on
// /about now (AboutPage.tsx).
export function About() {
  const { aboutSection } = content;
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead label={aboutSection.label} title={aboutSection.title} />
        <div className="about-grid">
          <Reveal delay={0.06} className="col-main">
            <div className="about-text">
              {aboutSection.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              <Link className="btn btn-ghost about-more" to="/about">להכיר אותי יותר</Link>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="col-side">
            <div className="about-photo-wrap">
              <Cinemagraph
                className="about-photo"
                src={aboutSection.photo}
                clip={clipFor(aboutSection.photo)}
                alt={aboutSection.photoAlt}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
