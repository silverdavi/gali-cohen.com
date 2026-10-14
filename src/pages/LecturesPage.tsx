import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { content, site } from '../content';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { photoSources } from '../lib/photo';
import { useMagnetic } from '../useMagnetic';

// A single talk, bookable on WhatsApp. The stage photo is shown whole so the
// photographer credit printed in the corner stays visible.
export function LecturesPage() {
  const { lecture } = content;
  const magnetic = useMagnetic();
  const whatsapp = `${site.whatsapp}?text=${encodeURIComponent(lecture.whatsappText)}`;
  useDocumentMeta(`${lecture.title} · גלי גאולה כהן`, lecture.paragraphs[0]?.slice(0, 160));

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: content.nav.lectures }]} />
      <div className="lecture-body">
        <SectionHead label={content.nav.lectures} title={lecture.title} sub={lecture.subtitle} as="h1" />
        <Reveal delay={0.08}>
          <figure className="lecture-hero">
            <img
              {...photoSources(lecture.hero.src)}
              alt={lecture.hero.alt}
              sizes="(max-width: 880px) 92vw, 480px"
            />
          </figure>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="lecture-copy">
            {lecture.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p className="lecture-duration">{lecture.duration}</p>
          </div>
          <section className="lecture-audience">
            <h2>{lecture.audienceLabel}</h2>
            <p>{lecture.audience}</p>
          </section>
          <a
            className="btn btn-primary btn-whatsapp lecture-cta"
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            {...magnetic}
          >
            {lecture.cta}
          </a>
          <div className="lecture-gallery">
            {lecture.gallery.map((photo) => (
              <figure key={photo.src}>
                <img
                  {...photoSources(photo.src)}
                  alt={photo.alt}
                  sizes="(max-width: 880px) 46vw, 340px"
                />
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
