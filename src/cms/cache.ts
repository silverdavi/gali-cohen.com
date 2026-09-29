// No runtime fetch exists in this architecture to cache (Rollup inlines every
// YAML file once, at build time) — a TTL/invalidation cache would be
// complexity with nothing to invalidate. What's actually useful, and what
// this module holds: the mapped domain arrays computed once at module load,
// and slug -> entity Maps built from them for O(1) route lookups instead of
// re-scanning arrays on every request.
//
// Building a Map is also the natural place to catch a duplicate slug — two
// entities racing for the same URL is a real authoring mistake, so this
// throws immediately (failing the build) rather than letting the second one
// silently overwrite the first.
import {
  servicesRaw, workshopsRaw, podcastRaw, videosRaw, blogRaw, storeRaw,
} from './repository';
import {
  mapServiceCategory, mapWorkshop, mapPodcastShow, mapVideo, mapArticle, mapProduct,
} from './mappers';
import type { ServiceCategory, Workshop, PodcastShow, Video, Article, Product } from './types';

function toMap<T>(items: T[], entityName: string, keyOf: (item: T) => string): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of items) {
    const key = keyOf(item);
    if (!key) continue; // unslugged items are simply not routable — validation.ts flags this separately
    if (map.has(key)) {
      throw new Error(`Duplicate ${entityName} slug "${key}" — every ${entityName} needs a unique slug.`);
    }
    map.set(key, item);
  }
  return map;
}

export const serviceCategories: ServiceCategory[] = (servicesRaw.categories ?? []).map(mapServiceCategory);
export const serviceCategoriesBySlug = toMap(serviceCategories, 'service category', (c) => c.slug);

export const workshops: Workshop[] = (workshopsRaw.items ?? []).map(mapWorkshop);
export const workshopsBySlug = toMap(workshops, 'workshop', (w) => w.slug);

export const podcastShows: PodcastShow[] = (podcastRaw.shows ?? []).map(mapPodcastShow);
export const podcastShowsBySlug = toMap(podcastShows, 'podcast show', (s) => s.slug);
// episode slugs only need to be unique *within* their show, not globally — key by "show/episode"
export const podcastEpisodesByKey = (() => {
  const map = new Map<string, { show: PodcastShow; episode: PodcastShow['episodes'][number] }>();
  for (const show of podcastShows) {
    for (const episode of show.episodes) {
      const key = `${show.slug}/${episode.slug}`;
      if (map.has(key)) {
        throw new Error(`Duplicate episode slug "${episode.slug}" in show "${show.slug}".`);
      }
      map.set(key, { show, episode });
    }
  }
  return map;
})();

export const videos: Video[] = (videosRaw.items ?? []).map(mapVideo);
export const videosBySlug = toMap(videos, 'video', (v) => v.slug);

export const articles: Article[] = (blogRaw.items ?? []).map(mapArticle);
export const articlesBySlug = toMap(articles, 'article', (a) => a.slug);

export const products: Product[] = (storeRaw.items ?? []).map(mapProduct);
export const productsBySlug = toMap(
  products.filter((p) => p.slug),
  'product',
  (p) => p.slug,
);
