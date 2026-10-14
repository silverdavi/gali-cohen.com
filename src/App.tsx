import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { SiteLayout } from './pages/SiteLayout';
import { Home } from './pages/Home';
import { ServicesHub } from './pages/ServicesHub';
import { ServiceCategoryPage } from './pages/ServiceCategoryPage';
import { WorkshopsList } from './pages/WorkshopsList';
import { LecturesPage } from './pages/LecturesPage';
import { WorkshopPage } from './pages/WorkshopPage';
import { AboutPage } from './pages/AboutPage';
import { BlogList } from './pages/BlogList';
import { ArticlePage } from './pages/ArticlePage';
import { PodcastShows } from './pages/PodcastShows';
import { PodcastShowPage } from './pages/PodcastShowPage';
import { PodcastEpisodePage } from './pages/PodcastEpisodePage';
import { VideosList } from './pages/VideosList';
import { VideoPage } from './pages/VideoPage';
import { StorePage } from './pages/StorePage';
import { ProductPage } from './pages/ProductPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LegalPage } from './components/LegalPage';
import { legal } from './content';
import { sectionEnabled } from './lib/sections';

// Real routes, real URLs — every route below also gets a static
// dist/<path>/index.html at build time (scripts/generate-static-pages.mjs)
// with entity-specific SEO tags, so a shared workshop/article/episode link
// unfurls correctly on WhatsApp/Facebook before any JS runs. Once JS boots,
// react-router-dom takes over client-side navigation between the same paths.
// GitHub Pages' 404.html (a copy of index.html) keeps every deep link
// bootable on a fresh load, same trick as before — just serving more routes
// now instead of only the three legal pages.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<ServicesHub />} />
          <Route path="services/:categorySlug" element={<ServiceCategoryPage />} />
          <Route path="workshops" element={<WorkshopsList />} />
          <Route path="lectures" element={<LecturesPage />} />
          <Route path="workshops/:slug" element={<WorkshopPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="blog" element={sectionEnabled('blog') ? <BlogList /> : <Navigate to="/" replace />} />
          <Route path="blog/:slug" element={sectionEnabled('blog') ? <ArticlePage /> : <Navigate to="/" replace />} />
          <Route path="podcast" element={sectionEnabled('podcast') ? <PodcastShows /> : <Navigate to="/" replace />} />
          <Route path="podcast/:showSlug" element={sectionEnabled('podcast') ? <PodcastShowPage /> : <Navigate to="/" replace />} />
          <Route path="podcast/:showSlug/:episodeSlug" element={sectionEnabled('podcast') ? <PodcastEpisodePage /> : <Navigate to="/" replace />} />
          <Route path="videos" element={sectionEnabled('videos') ? <VideosList /> : <Navigate to="/" replace />} />
          <Route path="videos/:slug" element={sectionEnabled('videos') ? <VideoPage /> : <Navigate to="/" replace />} />
          <Route path="store" element={sectionEnabled('store') ? <StorePage /> : <Navigate to="/" replace />} />
          <Route path="store/:slug" element={sectionEnabled('store') ? <ProductPage /> : <Navigate to="/" replace />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="accessibility" element={<LegalPage page={legal.accessibility} />} />
          <Route path="privacy" element={<LegalPage page={legal.privacy} />} />
          <Route path="terms" element={<LegalPage page={legal.terms} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
