// CMS-managed collections (activities, pricing, events, store).
//
// Unlike en.yaml / he.yaml — which are full per-language copies — these files
// store BOTH languages per record (…He / …En fields) in a single file, so the
// admin edits one form per item. This module flattens each record down to the
// active language and resolves checkout/signup fallbacks.
import { lang, site } from './index';
import activitiesFile from './activities.yaml';
import pricingFile from './pricing.yaml';
import eventsFile from './events.yaml';
import storeFile from './store.yaml';
import faqFile from './faq.yaml';
import blogFile from './blog.yaml';
import podcastFile from './podcast.yaml';

const isHe = lang === 'he';
/** pick the active-language string from a He/En pair */
const t = (he: string, en: string): string => (isHe ? he : en) ?? en ?? he ?? '';

// Empty links fall back to WhatsApp so every CTA always goes somewhere useful.
const whatsapp = site.whatsapp;
const checkout = (url?: string): string => (url && url.trim() ? url.trim() : whatsapp);

// --- raw file shapes (both languages) -------------------------------------
type RawHeading = {
  labelHe: string; labelEn: string;
  titleHe: string; titleEn: string;
  subHe?: string; subEn?: string;
  ctaHe?: string; ctaEn?: string;
};
type RawActivity = {
  titleHe: string; titleEn?: string;
  noteHe: string; noteEn?: string;
  bodyHe: string; bodyEn?: string;
  price?: string;
  photo: string; photoAltHe: string; photoAltEn?: string;
};
type RawPrice = {
  titleHe: string; titleEn: string;
  price: string; unitHe: string; unitEn: string;
  noteHe: string; noteEn: string; featured?: boolean; ctaUrl?: string;
};
type RawEvent = {
  date: string; time?: string;
  titleHe: string; titleEn: string;
  locationHe: string; locationEn: string;
  descHe: string; descEn: string; signupUrl?: string;
};
type RawProduct = {
  titleHe: string; titleEn: string;
  price: string; image: string;
  descHe: string; descEn: string; buyUrl?: string;
};
type RawFaq = { qHe: string; qEn: string; aHe: string; aEn: string };
type RawArticle = {
  titleHe: string; titleEn?: string;
  dateHe?: string; dateEn?: string;
  excerptHe: string; excerptEn?: string;
  bodyHe?: string; bodyEn?: string;
  url?: string;
};
type RawShow = {
  nameHe: string; nameEn?: string;
  descHe: string; descEn?: string;
  statusHe?: string; statusEn?: string;
  url?: string;
};
type Raw<I> = { heading: RawHeading; items: I[] };
type RawPodcast = { heading: RawHeading; shows: RawShow[] };

const activitiesRaw = activitiesFile as Raw<RawActivity>;
const pricingRaw = pricingFile as Raw<RawPrice>;
const eventsRaw = eventsFile as Raw<RawEvent> & { groupUrl?: string; groupLabelHe?: string; groupLabelEn?: string };
const storeRaw = storeFile as Raw<RawProduct>;
const faqRaw = faqFile as Raw<RawFaq>;
const blogRaw = blogFile as Raw<RawArticle>;
const podcastRaw = podcastFile as RawPodcast;

// --- localized, render-ready shapes ---------------------------------------
export type Heading = { label: string; title: string; sub: string; cta: string };
const heading = (h: RawHeading): Heading => ({
  label: t(h.labelHe, h.labelEn),
  title: t(h.titleHe, h.titleEn),
  sub: t(h.subHe ?? '', h.subEn ?? ''),
  cta: t(h.ctaHe ?? '', h.ctaEn ?? ''),
});

export type Activity = { title: string; note: string; body: string; price: string; photo: string; photoAlt: string };
export const activities = {
  heading: heading(activitiesRaw.heading),
  items: (activitiesRaw.items ?? []).map((i): Activity => ({
    title: t(i.titleHe, i.titleEn ?? ''),
    note: t(i.noteHe, i.noteEn ?? ''),
    body: t(i.bodyHe, i.bodyEn ?? ''),
    price: i.price ?? '',
    photo: i.photo,
    photoAlt: t(i.photoAltHe, i.photoAltEn ?? ''),
  })),
};

export type Price = { title: string; price: string; unit: string; note: string; featured: boolean; href: string };
export const pricing = {
  heading: heading(pricingRaw.heading),
  items: (pricingRaw.items ?? []).map((i): Price => ({
    title: t(i.titleHe, i.titleEn),
    price: i.price,
    unit: t(i.unitHe, i.unitEn),
    note: t(i.noteHe, i.noteEn),
    featured: Boolean(i.featured),
    href: checkout(i.ctaUrl),
  })),
};

const dateFmt = new Intl.DateTimeFormat(isHe ? 'he-IL' : 'en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});
export type EventItem = {
  title: string; location: string; desc: string; href: string;
  dateLabel: string; day: string; month: string; iso: string; time: string;
};
const monthFmt = new Intl.DateTimeFormat(isHe ? 'he-IL' : 'en-US', { month: 'short' });
// The YAML loader can parse a bare `2026-07-29` into a JS Date, so always coerce
// to a plain YYYY-MM-DD string before doing anything with it (never render a Date).
const isoDate = (v: unknown): string => {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? '');
};
export const events = {
  heading: heading(eventsRaw.heading),
  // Optional "quiet WhatsApp updates group" link shown under the events.
  group: eventsRaw.groupUrl && eventsRaw.groupUrl.trim()
    ? { url: eventsRaw.groupUrl.trim(), label: t(eventsRaw.groupLabelHe ?? '', eventsRaw.groupLabelEn ?? '') }
    : null,
  items: (eventsRaw.items ?? [])
    .slice()
    .sort((a, b) => isoDate(a.date).localeCompare(isoDate(b.date)))
    .map((i): EventItem => {
      const ds = isoDate(i.date);
      const d = new Date(`${ds}T${i.time || '00:00'}`);
      const valid = !Number.isNaN(d.getTime());
      return {
        title: t(i.titleHe, i.titleEn),
        location: t(i.locationHe, i.locationEn),
        desc: t(i.descHe, i.descEn),
        href: checkout(i.signupUrl),
        dateLabel: valid ? dateFmt.format(d) : ds,
        day: valid ? String(d.getDate()) : '',
        month: valid ? monthFmt.format(d) : '',
        iso: ds,
        time: i.time || '',
      };
    }),
};

export type Product = { title: string; price: string; image: string; desc: string; href: string };
export const store = {
  heading: heading(storeRaw.heading),
  items: (storeRaw.items ?? []).map((i): Product => ({
    title: t(i.titleHe, i.titleEn),
    price: i.price,
    image: i.image,
    desc: t(i.descHe, i.descEn),
    href: checkout(i.buyUrl),
  })),
};

export type Faq = { q: string; a: string };
export const faq = {
  heading: heading(faqRaw.heading),
  items: (faqRaw.items ?? []).map((i): Faq => ({
    q: t(i.qHe, i.qEn),
    a: t(i.aHe, i.aEn),
  })),
};

export type Article = { title: string; date: string; excerpt: string; body: string; href: string; external: boolean };
export const blog = {
  heading: heading(blogRaw.heading),
  items: (blogRaw.items ?? []).map((i): Article => ({
    title: t(i.titleHe, i.titleEn ?? ''),
    date: t(i.dateHe ?? '', i.dateEn ?? ''),
    excerpt: t(i.excerptHe, i.excerptEn ?? ''),
    body: t(i.bodyHe ?? '', i.bodyEn ?? ''),
    // A post with a body opens in a reader on the page; one with only a link
    // goes out to that link instead.
    href: (i.url && i.url.trim()) || '',
    external: Boolean(i.url && i.url.trim()),
  })),
};

export type Show = { name: string; desc: string; status: string; href: string };
export const podcast = {
  heading: heading(podcastRaw.heading),
  // A show with a `status` (e.g. "בקרוב") renders as coming-soon; otherwise it's
  // a live "listen" link.
  shows: (podcastRaw.shows ?? []).map((s): Show => ({
    name: t(s.nameHe, s.nameEn ?? ''),
    desc: t(s.descHe, s.descEn ?? ''),
    status: t(s.statusHe ?? '', s.statusEn ?? ''),
    href: checkout(s.url),
  })),
};

/** whether a link leaves the site (so we add target=_blank) */
export const isExternal = (href: string): boolean => /^https?:\/\//.test(href);
