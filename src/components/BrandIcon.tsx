import { siWhatsapp } from 'simple-icons';
import { BRAND_MAP, isMailLabel, isWhatsappLink } from '../lib/brandIcon';

const MAIL_PATH =
  'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5z';

export function BrandIcon({ name, url }: { name: string; url?: string }) {
  const key = name.trim().toLowerCase();
  if (isMailLabel(key)) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden focusable="false">
        <path d={MAIL_PATH} fill="currentColor" />
      </svg>
    );
  }
  const icon = isWhatsappLink(url) ? siWhatsapp : BRAND_MAP[key];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" style={{ ['--brand' as string]: `#${icon.hex}` }}>
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}
