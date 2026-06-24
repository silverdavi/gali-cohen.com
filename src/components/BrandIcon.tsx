import { siInstagram, siWhatsapp, siFacebook, siYoutube, siTiktok, siSpotify } from 'simple-icons';

type Icon = { path: string; hex: string; title: string };

// Map a social label (as typed in the CMS) to its brand glyph. Case-insensitive
// so "Instagram" / "instagram" both work. Email is a hand-drawn envelope since
// it isn't a brand.
const MAP: Record<string, Icon> = {
  instagram: siInstagram,
  whatsapp: siWhatsapp,
  facebook: siFacebook,
  youtube: siYoutube,
  tiktok: siTiktok,
  spotify: siSpotify,
};

const MAIL_PATH =
  'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5z';

export function BrandIcon({ name }: { name: string }) {
  const key = name.trim().toLowerCase();
  if (key === 'email' || key === 'mail' || key.includes('@')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden focusable="false">
        <path d={MAIL_PATH} fill="currentColor" />
      </svg>
    );
  }
  const icon = MAP[key];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" style={{ ['--brand' as string]: `#${icon.hex}` }}>
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}
