import { siInstagram, siWhatsapp, siFacebook, siYoutube, siTiktok, siSpotify, siX, siThreads, siApplepodcasts } from 'simple-icons';

export type Icon = { path: string; hex: string; title: string };

// Map a social label (as typed in the CMS) to its brand glyph. Case-insensitive
// so "Instagram" / "instagram" both work. Email is a hand-drawn envelope since
// it isn't a brand.
export const BRAND_MAP: Record<string, Icon> = {
  instagram: siInstagram,
  whatsapp: siWhatsapp,
  facebook: siFacebook,
  youtube: siYoutube,
  tiktok: siTiktok,
  spotify: siSpotify,
  x: siX,
  threads: siThreads,
  'apple podcasts': siApplepodcasts,
  applepodcasts: siApplepodcasts,
};

export const isMailLabel = (key: string) => key === 'email' || key === 'mail' || key.includes('@');
// A CMS entry can be labelled in free text (e.g. "קבוצת ווצאפ שקטה לעדכונים")
// rather than the brand name — sniff the URL too so it still reads as WhatsApp.
export const isWhatsappLink = (url?: string) => !!url && /(whatsapp\.com|wa\.me)/i.test(url);

/** Whether BrandIcon actually has a glyph for this label/url — check before
 * rendering a slot for it, so an unmapped label never becomes an empty circle. */
export function hasBrandIcon(name: string, url?: string): boolean {
  const key = name.trim().toLowerCase();
  return isMailLabel(key) || isWhatsappLink(url) || key in BRAND_MAP;
}
