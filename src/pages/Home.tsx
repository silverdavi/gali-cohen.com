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
import { FreeCall } from '../components/FreeCall';
import { content } from '../content';
import { getHomepageConfig } from '../cms/queries';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { sectionEnabled } from '../lib/sections';

// Order: who she is, how to work with her, the next workshop, testimonials,
// then the free intro call. homepage.* in he.yaml turns a block on or off.
// The longer contact form lives on /contact, so the homepage doesn't repeat it.
export function Home() {
  const cfg = getHomepageConfig();
  useDocumentMeta(content.meta.title, content.meta.description);
  const showWriting = cfg.content.enabled && (sectionEnabled('blog') || sectionEnabled('podcast') || sectionEnabled('videos'));

  return (
    <>
      <Hero />
      {cfg.services.enabled && <ServicesTeaser />}
      {cfg.workshops.enabled && <WorkshopsTeaser limit={cfg.workshops.limit} />}
      {cfg.testimonials.enabled && <Words />}
      {showWriting && (
        <section className="section" id="content">
          <div className="container">
            <SectionHead label="תוכן" title="מאמרים, פודקאסט וסרטונים" />
            {sectionEnabled('blog') && <BlogTeaser limit={3} />}
            {sectionEnabled('podcast') && <PodcastTeaser />}
            {sectionEnabled('videos') && <VideosTeaser limit={3} />}
          </div>
        </section>
      )}
      {cfg.about.enabled && <About />}
      {cfg.store.enabled && sectionEnabled('store') && <Store />}
      {cfg.contact.enabled && <FreeCall />}
    </>
  );
}
