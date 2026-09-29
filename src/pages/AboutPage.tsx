import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Cinemagraph } from '../components/Cinemagraph';
import { content } from '../content';
import { clipFor } from '../clips';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { features } from '../features';

// Full about page: the home teaser's photo + paragraphs + facts, folding in
// the personal-story lecture content (Story.tsx used to be its own section,
// gated by showStory — it reads naturally as the deeper half of "who she is").
export function AboutPage() {
  const { aboutSection, storySection } = content;
  useDocumentMeta(`${aboutSection.title} · גלי גאולה כהן`, aboutSection.paragraphs[0]?.slice(0, 160));

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: content.nav.about }]} />
      <SectionHead label={aboutSection.label} title={aboutSection.title} as="h1" />
      <div className="about-grid">
        <Reveal delay={0.06} className="col-main">
          <div className="about-text">
            {aboutSection.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.12} className="col-side">
          <div>
            <Cinemagraph
              className="about-photo"
              src={aboutSection.photo}
              clip={clipFor(aboutSection.photo)}
              alt={aboutSection.photoAlt}
            />
            {aboutSection.facts.length > 0 && (
              <div className="about-facts">
                {aboutSection.facts.map((f) => (
                  <div className="fact" key={f.label}>
                    <span className="fact-label">{f.label}</span>
                    <span className="fact-value">{f.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {features.showStory && (
        <div className="section story-embed">
          <SectionHead label={storySection.label} title={storySection.title} sub={storySection.lead} />
          <div className="story-grid">
            <Reveal delay={0.06} className="col-main">
              <div className="story-text">
                {storySection.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                <p className="story-meta">{storySection.meta}</p>
              </div>
            </Reveal>
            <Reveal delay={0.12} className="col-side">
              <div className="story-photos">
                {storySection.photos.map((ph) => (
                  <figure className="story-photo" key={ph.src}>
                    <img src={ph.src} alt={ph.alt} loading="lazy" decoding="async" />
                  </figure>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      )}
    </div>
  );
}
