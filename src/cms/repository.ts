// The only module that touches raw, Git-backed YAML. Everything here mirrors
// exactly what's on disk (via @rollup/plugin-yaml, inlined at build time —
// there is no runtime fetch, so "repository" means "content source", not a
// network client). `mappers.ts` turns these raw shapes into the domain types
// in `types.ts`; nothing outside `src/cms/` should import from here directly.

import servicesFile from '../content/services.yaml';
import workshopsFile from '../content/workshops.yaml';
import podcastFile from '../content/podcast.yaml';
import videosFile from '../content/videos.yaml';
import blogFile from '../content/blog.yaml';
import storeFile from '../content/store.yaml';

export type RawHeading = { labelHe: string; titleHe: string; subHe?: string; ctaHe?: string };

export type RawPrice = {
  priceType: 'fixed' | 'contact';
  price: number | null;
  currency?: 'ILS';
  priceUnit?: 'session' | 'person' | 'package' | '';
};

export type RawServiceTrack = RawPrice & {
  titleHe: string;
  noteHe?: string;
  bodyHe: string;
  photo?: string;
  photoAltHe?: string;
};

export type RawProcessStep = { titleHe: string; bodyHe: string };

export type RawServiceCategory = {
  slug: string;
  titleHe: string;
  shortDescHe: string;
  photo: string;
  photoAltHe: string;
  metaDescriptionHe: string;
  tracks: RawServiceTrack[];
  processSteps?: RawProcessStep[];
};

export type RawServicesFile = { heading: RawHeading; categories: RawServiceCategory[] };

export type RawFaqItem = { qHe: string; aHe: string };

export type RawWorkshop = RawPrice & {
  slug: string;
  titleHe: string;
  date: string | Date;
  time?: string;
  endTime?: string;
  locationHe: string;
  locationUrl?: string;
  descHe: string;
  metaDescriptionHe?: string;
  image?: string;
  gallery?: string[];
  categorySlug?: string;
  signupUrl?: string;
  capacity?: string;
  status: 'draft' | 'upcoming' | 'sold-out' | 'completed' | 'cancelled';
  featured?: boolean;
  enabled?: boolean;
  introHe?: string;
  whatHappensHe?: string;
  whoForHe?: string;
  faq?: RawFaqItem[];
};

export type RawWorkshopsFile = {
  heading: RawHeading;
  groupUrl?: string;
  groupLabelHe?: string;
  items: RawWorkshop[];
};

export type RawPodcastEpisode = {
  slug: string;
  titleHe: string;
  descHe?: string;
  publishedDate?: string;
  durationMinutes?: number;
  youtubeVideoId?: string;
  coverImage?: string;
};

export type RawPodcastShow = {
  slug: string;
  nameHe: string;
  descHe?: string;
  statusHe?: string;
  coverImage?: string;
  platformLinks?: { label: string; url: string }[];
  episodes?: RawPodcastEpisode[];
};

export type RawPodcastFile = { heading: RawHeading; shows: RawPodcastShow[] };

export type RawVideo = {
  slug: string;
  titleHe: string;
  descHe?: string;
  metaDescriptionHe?: string;
  thumbnail?: string;
  provider: 'youtube' | 'vimeo' | 'external';
  videoId?: string;
  videoUrl?: string;
  publishedDate?: string;
  featured?: boolean;
  order?: number;
  enabled?: boolean;
};

export type RawVideosFile = { heading: RawHeading; items: RawVideo[] };

export type RawArticle = {
  slug?: string;
  titleHe: string;
  dateISO?: string;
  image?: string;
  excerptHe: string;
  bodyHe?: string;
  url?: string;
};

export type RawBlogFile = { heading: RawHeading; items: RawArticle[] };

export type RawOrderForm = { titleHe: string; noteHe: string; notePlaceholderHe: string; submitHe: string };

export type RawProduct = {
  titleHe: string;
  slug?: string;
  category?: string;
  image: string;
  descHe: string;
  price: number;
  currency?: 'ILS';
  salePrice?: number | null;
  active?: boolean;
  featured?: boolean;
  order?: number;
  buyUrl?: string;
};

export type RawStoreFile = { heading: RawHeading; order: RawOrderForm; items: RawProduct[] };

export const servicesRaw = servicesFile as RawServicesFile;
export const workshopsRaw = workshopsFile as RawWorkshopsFile;
export const podcastRaw = podcastFile as RawPodcastFile;
export const videosRaw = videosFile as RawVideosFile;
export const blogRaw = blogFile as RawBlogFile;
export const storeRaw = storeFile as RawStoreFile;
