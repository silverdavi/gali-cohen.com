// The one module components (and the static-generation script) import
// content from. Pure functions, no React import — so both callers get
// identical slug/sort/filter behavior and it never drifts between them.
import { content } from '../content';
import { servicesRaw, workshopsRaw, podcastRaw, videosRaw, blogRaw, storeRaw } from './repository';
import { mapHeading, formatPrice, formatProductPrice } from './mappers';
import {
  serviceCategories, serviceCategoriesBySlug,
  workshops, workshopsBySlug,
  podcastShows, podcastShowsBySlug, podcastEpisodesByKey,
  videos, videosBySlug,
  articles, articlesBySlug,
  products, productsBySlug,
} from './cache';
import type {
  ServiceCategory, Workshop, PodcastShow, PodcastEpisode, Video, Article, Product,
  Testimonial, HomepageConfig, OrderForm,
} from './types';

export { formatPrice, formatProductPrice };
export { isExternal } from './mappers';

// --- headings ---------------------------------------------------------------
export const servicesHeading = mapHeading(servicesRaw.heading);
export const workshopsHeading = mapHeading(workshopsRaw.heading);
export const podcastHeading = mapHeading(podcastRaw.heading);
export const videosHeading = mapHeading(videosRaw.heading);
export const blogHeading = mapHeading(blogRaw.heading);
export const storeHeading = mapHeading(storeRaw.heading);
export const storeOrderForm: OrderForm = {
  title: storeRaw.order.titleHe,
  note: storeRaw.order.noteHe,
  notePlaceholder: storeRaw.order.notePlaceholderHe,
  submit: storeRaw.order.submitHe,
};
export const workshopsGroup = workshopsRaw.groupUrl?.trim()
  ? { url: workshopsRaw.groupUrl.trim(), label: workshopsRaw.groupLabelHe ?? '' }
  : null;

// --- services -----------------------------------------------------------------
export const getAllServiceCategories = (): ServiceCategory[] => serviceCategories;
export const getServiceCategoryBySlug = (slug: string): ServiceCategory | undefined =>
  serviceCategoriesBySlug.get(slug);

// --- workshops ------------------------------------------------------------
const PUBLIC_UPCOMING: Workshop['status'][] = ['upcoming', 'sold-out'];

export const getAllWorkshops = (): Workshop[] => workshops;

export const getUpcomingWorkshops = (limit?: number): Workshop[] => {
  const list = workshops
    .filter((w) => w.enabled && PUBLIC_UPCOMING.includes(w.status))
    .sort((a, b) => a.iso.localeCompare(b.iso));
  return typeof limit === 'number' ? list.slice(0, limit) : list;
};

export const getPastWorkshops = (): Workshop[] =>
  workshops
    .filter((w) => w.enabled && w.status === 'completed')
    .sort((a, b) => b.iso.localeCompare(a.iso));

export const getWorkshopBySlug = (slug: string): Workshop | undefined => workshopsBySlug.get(slug);

/** other publicly-visible workshops sharing a category, for the detail page's
    "related workshops" module — not CMS-authored, computed at read time. */
export const getRelatedWorkshops = (workshop: Workshop, limit = 3): Workshop[] =>
  getUpcomingWorkshops()
    .filter((w) => w.slug !== workshop.slug && w.categorySlug && w.categorySlug === workshop.categorySlug)
    .slice(0, limit);

// --- podcast ----------------------------------------------------------------
export const getAllShows = (): PodcastShow[] => podcastShows;
export const getShowBySlug = (slug: string): PodcastShow | undefined => podcastShowsBySlug.get(slug);
export const getEpisode = (showSlug: string, episodeSlug: string): { show: PodcastShow; episode: PodcastEpisode } | undefined =>
  podcastEpisodesByKey.get(`${showSlug}/${episodeSlug}`);

// --- videos -------------------------------------------------------------------
export const getAllVideos = (): Video[] => videos.filter((v) => v.enabled).sort((a, b) => a.order - b.order);
export const getVideoBySlug = (slug: string): Video | undefined => videosBySlug.get(slug);

// --- articles -------------------------------------------------------------
export const getAllArticles = (): Article[] =>
  articles.slice().sort((a, b) => b.dateISO.localeCompare(a.dateISO));
export const getArticleBySlug = (slug: string): Article | undefined => articlesBySlug.get(slug);

// --- store ------------------------------------------------------------------
export const getAllProducts = (): Product[] =>
  products.filter((p) => p.active).sort((a, b) => a.order - b.order);
export const getProductBySlug = (slug: string): Product | undefined => productsBySlug.get(slug);

// --- testimonials + homepage config (from he.yaml's sitewide content) -----
export const getFeaturedTestimonials = (limit?: number): Testimonial[] => {
  const list = content.wordsSection.items
    .filter((i) => i.featured)
    .map((i) => ({ quote: i.quote, name: i.name, featured: true }));
  return typeof limit === 'number' ? list.slice(0, limit) : list;
};

export const getHomepageConfig = (): HomepageConfig => content.homepage;
