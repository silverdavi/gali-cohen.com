import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { ServicesTeaser } from '../components/ServicesTeaser';
import { WorkshopsTeaser } from '../components/WorkshopsTeaser';
import { Words } from '../components/Words';
import { SectionHead } from '../components/SectionHead';
import { BlogTeaser } from '../components/BlogTeaser';
import { PodcastTeaser } from '../components/PodcastTeaser';
import { VideosTeaser } from '../components/VideosTeaser';
import { Store } from '../components/Store';
import { Contact } from '../components/Contact';
import { content } from '../content';
import { getFeaturedTestimonials, getHomepageConfig } from '../cms/queries';
import { useDocumentMeta } from '../lib/useDocumentMeta';

// The gateway page — short, each section a teaser onward to its own full
// page. Section order is fixed here; the homepage.* config in he.yaml only
// controls whether a section shows at all and how many items it teases.
export function Home() {
  const cfg = getHomepageConfig();
  const featured = getFeaturedTestimonials(cfg.testimonials.limit);
  useDocumentMeta(content.meta.title, content.meta.description);

  return (
    <>
      <Hero />
      {cfg.services.enabled && <ServicesTeaser />}
      {cfg.workshops.enabled && <WorkshopsTeaser limit={cfg.workshops.limit} />}
      {cfg.about.enabled && <About />}
      {cfg.testimonials.enabled && featured.length > 0 && <Words items={featured} />}
      {cfg.content.enabled && (
        <section className="section" id="content">
          <div className="container">
            <SectionHead label="תוכן" title="מאמרים, פודקאסט וסרטונים" />
            <BlogTeaser limit={3} />
            <PodcastTeaser />
            <VideosTeaser limit={3} />
          </div>
        </section>
      )}
      {cfg.store.enabled && <Store />}
      {cfg.contact.enabled && (
        <section className="section" id="contact-section">
          <div className="container">
            <Contact />
          </div>
        </section>
      )}
    </>
  );
}
