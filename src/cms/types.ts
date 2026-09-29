// Domain types every component/page consumes. Nothing here mirrors the raw
// YAML shape verbatim — that's `repository.ts`'s job. Components only ever
// import from `queries.ts`, and only ever see these types.

export type Heading = { label: string; title: string; sub: string; cta: string };

export type PriceType = 'fixed' | 'contact';
export type PriceUnit = 'session' | 'person' | 'package' | '';
export type Price = { type: PriceType; amount: number | null; currency: 'ILS'; unit: PriceUnit };

export type ServiceTrack = {
  title: string;
  note: string;
  body: string;
  price: Price;
  photo: string;
  photoAlt: string;
};

export type ProcessStep = { title: string; body: string };

export type ServiceCategory = {
  slug: string;
  title: string;
  shortDesc: string;
  photo: string;
  photoAlt: string;
  metaDescription: string;
  tracks: ServiceTrack[];
  /** the guidance journey, "01/02/03" style — optional, empty until Gali supplies it */
  processSteps: ProcessStep[];
};

export type WorkshopStatus = 'draft' | 'upcoming' | 'sold-out' | 'completed' | 'cancelled';

export type FaqItem = { q: string; a: string };

export type Workshop = {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  iso: string;
  time: string;
  endTime: string;
  location: string;
  locationUrl: string;
  desc: string;
  metaDescription: string;
  image: string;
  gallery: string[];
  categorySlug: string;
  signupHref: string;
  /** whether signupHref is a real link Gali supplied, vs. the bare WhatsApp fallback */
  hasSignupLink: boolean;
  price: Price;
  capacity: string;
  status: WorkshopStatus;
  featured: boolean;
  enabled: boolean;
  dateLabel: string;
  day: string;
  month: string;
  /** short emotional opener, distinct from the practical `desc` — optional */
  intro: string;
  /** optional, plain text */
  whatHappens: string;
  /** optional, plain text */
  whoFor: string;
  /** optional, empty until Gali supplies real Q&A */
  faq: FaqItem[];
};

export type PodcastPlatformLink = { label: string; url: string };

export type PodcastEpisode = {
  slug: string;
  title: string;
  desc: string;
  publishedDate: string;
  durationMinutes: number;
  youtubeVideoId: string;
  coverImage: string;
};

export type PodcastShow = {
  slug: string;
  name: string;
  desc: string;
  status: string;
  coverImage: string;
  platformLinks: PodcastPlatformLink[];
  episodes: PodcastEpisode[];
  /** first playable link, resolved for the "whole playlist" fallback embed */
  embedHref: string;
};

export type VideoProvider = 'youtube' | 'vimeo' | 'external';

export type Video = {
  slug: string;
  title: string;
  desc: string;
  metaDescription: string;
  thumbnail: string;
  provider: VideoProvider;
  videoId: string;
  videoUrl: string;
  publishedDate: string;
  featured: boolean;
  order: number;
  enabled: boolean;
};

export type Article = {
  slug: string;
  title: string;
  /** YYYY-MM-DD, '' if unset */
  dateISO: string;
  image: string;
  excerpt: string;
  body: string;
  href: string;
  external: boolean;
};

export type Product = {
  slug: string;
  title: string;
  category: string;
  image: string;
  desc: string;
  price: number;
  currency: 'ILS';
  salePrice: number | null;
  active: boolean;
  featured: boolean;
  order: number;
  href: string;
  hasCheckout: boolean;
};

export type OrderForm = { title: string; note: string; notePlaceholder: string; submit: string };

export type Testimonial = { quote: string; name: string; featured: boolean };

export type HomepageSectionConfig = { enabled: boolean; limit?: number };
export type HomepageConfig = {
  services: HomepageSectionConfig;
  workshops: HomepageSectionConfig;
  about: HomepageSectionConfig;
  testimonials: HomepageSectionConfig;
  content: HomepageSectionConfig;
  store: HomepageSectionConfig;
  contact: HomepageSectionConfig;
};
