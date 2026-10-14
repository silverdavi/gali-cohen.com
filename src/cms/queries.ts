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
/** Opening paragraphs on the תהליכים אישיים page, above the category cards. */
export const servicesIntro: string[] = servicesRaw.introHe ?? [];
export const workshopsHeading = mapHeading(workshopsRaw.heading);
export const upcomingWorkshopsTitle = (workshopsRaw.upcomingTitleHe ?? '').trim();
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

/** Calendar day in Israel. Workshop dates are Tel Aviv dates, so a listing
 *  must not depend on the visitor's timezone or on UTC midnight. */
function todayInIsrael(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** An upcoming/sold-out workshop whose calendar date is already over is no
 *  longer listed. Today still counts — the event may be later this evening.
 *  A missing or non-ISO date is left visible rather than dropped silently. */
function isOnOrAfterToday(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return true;
  return iso >= todayInIsrael();
}

function sortUpcoming(list: Workshop[]): Workshop[] {
  return list.sort((a, b) => {
    const aDated = /^\d{4}-\d{2}-\d{2}$/.test(a.iso);
    const bDated = /^\d{4}-\d{2}-\d{2}$/.test(b.iso);
    if (aDated && bDated) return a.iso.localeCompare(b.iso);
    if (aDated) return -1;
    if (bDated) return 1;
    return 0;
  });
}

function listedUpcoming(include: (w: Workshop) => boolean): Workshop[] {
  return sortUpcoming(
    workshops.filter(
      (w) => w.enabled && include(w) && PUBLIC_UPCOMING.includes(w.status) && (w.ongoing || isOnOrAfterToday(w.iso)),
    ),
  );
}

export const getUpcomingWorkshops = (limit?: number): Workshop[] => {
  const list = listedUpcoming((w) => !w.inUpcomingSection);
  return typeof limit === 'number' ? list.slice(0, limit) : list;
};

/** One-time workshops shown under סדנאות קרובות. Kept out of the featured
 *  next-workshop slot so that slot stays on the workshop it already shows. */
export const getUpcomingSectionWorkshops = (): Workshop[] =>
  listedUpcoming((w) => w.inUpcomingSection);

/** Homepage cards keep the limited upcoming list, then append workshops that
 *  asked to stay on the homepage. The dated "next" workshop stays first. */
export function getHomepageWorkshops(limit?: number): Workshop[] {
  const upcoming = getUpcomingWorkshops(limit);
  const extras = getUpcomingWorkshops().filter(
    (w) => w.showOnHome && !upcoming.some((u) => u.slug === w.slug),
  );
  return [...upcoming, ...extras];
}

/** Per-person price, plus the couple amount when the workshop has one.
 *  A verbatim price label (a recommended range, for example) is shown as written. */
export function formatWorkshopPrice(w: Workshop): string {
  if (w.priceLabel) return w.priceLabel;
  const base = formatPrice(w.price);
  return w.priceNote ? `${base} (${w.priceNote})` : base;
}

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
export const getAllShows = (): PodcastShow[] => podcastShows.filter((s) => s.enabled);
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

/** Title and description used both in the page `<head>` (after JS) and in the
 *  static HTML a share preview or crawler reads. The date keeps two workshops
 *  with the same name from looking identical when shared. */
export function workshopShareMeta(w: Workshop): { title: string; description: string } {
  const description = (w.metaDescription || w.desc).replace(/\s+/g, ' ').trim().slice(0, 160);
  return {
    title: `${w.title} · ${w.dateLabel} · גלי גאולה כהן`,
    description,
  };
}
