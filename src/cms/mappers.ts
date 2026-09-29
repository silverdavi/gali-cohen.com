// Pure raw -> domain mapping functions, one per entity. No React import here —
// `queries.ts` (also pure) and the Node static-generation script both need to
// call these identically, so nothing here may depend on a browser/DOM global.
//
// Every *He field is used directly now (no bilingual t() picker): the site has
// no language switcher, `lang` was always hardcoded to 'he', and the old *En
// fields were already stale/mismatched with their Hebrew counterparts — so
// this redesign drops them from the content files entirely rather than
// migrating copy that was already wrong.
import { site } from '../content';
import type {
  RawHeading, RawPrice, RawServiceTrack, RawServiceCategory, RawProcessStep, RawWorkshop,
  RawFaqItem, RawPodcastShow, RawPodcastEpisode, RawVideo, RawArticle, RawProduct,
} from './repository';
import type {
  Heading, Price, ServiceTrack, ServiceCategory, ProcessStep, Workshop, FaqItem, PodcastShow,
  PodcastEpisode, Video, Article, Product, PriceUnit,
} from './types';

// Empty links fall back to WhatsApp so every CTA always goes somewhere useful.
const whatsapp = site.whatsapp;
export const checkout = (url?: string): string => (url && url.trim() ? url.trim() : whatsapp);

/** whether a link leaves the site (so we add target=_blank) */
export const isExternal = (href: string): boolean => /^https?:\/\//.test(href);

// The YAML loader can parse a bare `2026-07-29` into a JS Date, so always
// coerce to a plain YYYY-MM-DD string before doing anything with it.
export const isoDate = (v: unknown): string => {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? '');
};

export function mapHeading(h: RawHeading): Heading {
  return { label: h.labelHe, title: h.titleHe, sub: h.subHe ?? '', cta: h.ctaHe ?? '' };
}

export function mapPrice(p: RawPrice): Price {
  return {
    type: p.priceType,
    amount: p.priceType === 'fixed' ? (p.price ?? null) : null,
    currency: 'ILS',
    unit: (p.priceUnit ?? '') as PriceUnit,
  };
}

const UNIT_LABEL: Record<string, string> = { session: 'למפגש', person: 'לאדם', package: 'לחבילה' };
/** The one place a price becomes a display string — the CMS field itself is never pre-formatted. */
export function formatPrice(price: Price): string {
  if (price.type === 'contact' || price.amount == null) return 'לפרטים ומחיר - צרו קשר';
  const unit = price.unit ? (UNIT_LABEL[price.unit] ?? price.unit) : '';
  return unit ? `₪${price.amount} · ${unit}` : `₪${price.amount}`;
}

/** Store products aren't a Price (no priceType/unit — always a flat number, optionally on sale). */
export function formatProductPrice(price: number, salePrice: number | null): { current: string; original: string | null } {
  if (salePrice != null && salePrice < price) {
    return { current: `₪${salePrice}`, original: `₪${price}` };
  }
  return { current: `₪${price}`, original: null };
}

export function mapServiceTrack(t: RawServiceTrack): ServiceTrack {
  return {
    title: t.titleHe,
    note: t.noteHe ?? '',
    body: t.bodyHe,
    price: mapPrice(t),
    photo: t.photo ?? '',
    photoAlt: t.photoAltHe ?? '',
  };
}

export function mapProcessStep(s: RawProcessStep): ProcessStep {
  return { title: s.titleHe, body: s.bodyHe };
}

export function mapServiceCategory(c: RawServiceCategory): ServiceCategory {
  return {
    slug: c.slug,
    title: c.titleHe,
    shortDesc: c.shortDescHe,
    photo: c.photo,
    photoAlt: c.photoAltHe,
    metaDescription: c.metaDescriptionHe,
    tracks: (c.tracks ?? []).map(mapServiceTrack),
    processSteps: (c.processSteps ?? []).map(mapProcessStep),
  };
}

const dateFmt = new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
const monthFmt = new Intl.DateTimeFormat('he-IL', { month: 'short' });

export function mapFaqItem(f: RawFaqItem): FaqItem {
  return { q: f.qHe, a: f.aHe };
}

export function mapWorkshop(w: RawWorkshop): Workshop {
  const iso = isoDate(w.date);
  const d = new Date(`${iso}T${w.time || '00:00'}`);
  const valid = !Number.isNaN(d.getTime());
  return {
    slug: w.slug,
    title: w.titleHe,
    iso,
    time: w.time ?? '',
    endTime: w.endTime ?? '',
    location: w.locationHe,
    locationUrl: w.locationUrl ?? '',
    desc: w.descHe,
    metaDescription: w.metaDescriptionHe ?? '',
    image: w.image ?? '',
    gallery: w.gallery ?? [],
    categorySlug: w.categorySlug ?? '',
    signupHref: checkout(w.signupUrl),
    hasSignupLink: Boolean(w.signupUrl && w.signupUrl.trim()),
    price: mapPrice(w),
    capacity: w.capacity ?? '',
    status: w.status,
    featured: Boolean(w.featured),
    enabled: w.enabled !== false,
    dateLabel: valid ? dateFmt.format(d) : iso,
    day: valid ? String(d.getDate()) : '',
    month: valid ? monthFmt.format(d) : '',
    intro: w.introHe ?? '',
    whatHappens: w.whatHappensHe ?? '',
    whoFor: w.whoForHe ?? '',
    faq: (w.faq ?? []).map(mapFaqItem),
  };
}

export function mapPodcastEpisode(e: RawPodcastEpisode): PodcastEpisode {
  return {
    slug: e.slug,
    title: e.titleHe,
    desc: e.descHe ?? '',
    publishedDate: e.publishedDate ?? '',
    durationMinutes: e.durationMinutes ?? 0,
    youtubeVideoId: e.youtubeVideoId ?? '',
    coverImage: e.coverImage ?? '',
  };
}

export function mapPodcastShow(s: RawPodcastShow): PodcastShow {
  const platformLinks = s.platformLinks ?? [];
  return {
    slug: s.slug,
    name: s.nameHe,
    desc: s.descHe ?? '',
    status: s.statusHe ?? '',
    coverImage: s.coverImage ?? '',
    platformLinks,
    episodes: (s.episodes ?? []).map(mapPodcastEpisode),
    embedHref: checkout(platformLinks[0]?.url),
  };
}

export function mapVideo(v: RawVideo): Video {
  return {
    slug: v.slug,
    title: v.titleHe,
    desc: v.descHe ?? '',
    metaDescription: v.metaDescriptionHe ?? '',
    thumbnail: v.thumbnail ?? '',
    provider: v.provider,
    videoId: v.videoId ?? '',
    videoUrl: v.videoUrl ?? '',
    publishedDate: v.publishedDate ?? '',
    featured: Boolean(v.featured),
    order: v.order ?? 0,
    enabled: v.enabled !== false,
  };
}

export function mapArticle(a: RawArticle): Article {
  return {
    slug: a.slug ?? '',
    title: a.titleHe,
    dateISO: a.dateISO ?? '',
    image: a.image ?? '',
    excerpt: a.excerptHe,
    body: a.bodyHe ?? '',
    // A post with a body opens in a reader page; one with only a link goes out to that link.
    href: (a.url && a.url.trim()) || '',
    external: Boolean(a.url && a.url.trim()),
  };
}

export function mapProduct(p: RawProduct): Product {
  return {
    slug: p.slug ?? '',
    title: p.titleHe,
    category: p.category ?? '',
    image: p.image,
    desc: p.descHe,
    price: p.price,
    currency: 'ILS',
    salePrice: p.salePrice ?? null,
    active: p.active !== false,
    featured: Boolean(p.featured),
    order: p.order ?? 0,
    href: checkout(p.buyUrl),
    hasCheckout: Boolean(p.buyUrl && p.buyUrl.trim()),
  };
}
