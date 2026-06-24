// Multilingual content loader. All copy lives in per-language YAML files
// (en.yaml / he.yaml) — never hardcoded in components. English is the dev
// language for now; flip DEFAULT_LANG to 'he' when the Hebrew copy is real.
import en from './en.yaml';
import he from './he.yaml';
import siteFile from './site.yaml';

export type Lang = 'en' | 'he';

// Language-neutral contact + social links, edited once in the CMS.
export type SocialLink = { label: string; url: string };
export type Site = {
  email: string;
  instagram: string;
  whatsapp: string;
  socials?: SocialLink[];
};
export const site = siteFile as Site;

export type Content = {
  meta: { title: string; description: string };
  nav: {
    practices: string; circles: string; about: string; story: string;
    pricing: string; events: string; shop: string; cta: string; skip: string;
    services: string; faq: string; blog: string; podcast: string;
    words: string; contact: string; menu: string; close: string;
  };
  profile: {
    name: string;
    hebrewName: string;
    kicker: string;
    role: string;
    lead: string;
  };
  hero: { ctaPrimary: string; ctaSecondary: string; scroll: string; photoAlt: string };
  breath: { label: string; title: string; wordIn: string; wordHold: string; wordOut: string; note: string };
  circle: { label: string; title: string; body: string; caption: string; alt: string };
  band: { photo: string; caption: string; alt: string };
  aboutSection: {
    label: string;
    title: string;
    photo: string;
    photoAlt: string;
    paragraphs: string[];
    facts: { label: string; value: string }[];
  };
  storySection: {
    label: string;
    title: string;
    lead: string;
    paragraphs: string[];
    meta: string;
    photos: { src: string; alt: string }[];
  };
  wordsSection: { label: string; items: { quote: string; name: string }[] };
  freeCall: { label: string; title: string; body: string; cta: string; note: string };
  socialSection: { label: string; title: string; sub: string };
  astro: {
    label: string;
    title: string;
    sub: string;
    sunLabel: string;
    moonLabel: string;
    litWord: string;
    findTitle: string;
    findSub: string;
    monthLabel: string;
    dayLabel: string;
    reveal: string;
    yourSign: string;
    again: string;
    moonPhases: {
      new: string; waxingCrescent: string; firstQuarter: string; waxingGibbous: string;
      full: string; waningGibbous: string; lastQuarter: string; waningCrescent: string;
    };
  };
  contact: { line: string; sub: string; whatsapp: string; instagram: string };
  footer: { place: string; credit: string };
};

const CONTENT: Record<Lang, Content> = {
  en: en as Content,
  he: he as Content,
};

export const DEFAULT_LANG: Lang = 'he'; // Hebrew is the default; 'en' kept for a future language switch
export const DIR: Record<Lang, 'ltr' | 'rtl'> = { en: 'ltr', he: 'rtl' };

export const lang: Lang = DEFAULT_LANG;
export const content: Content = CONTENT[lang];
export const dir = DIR[lang];
