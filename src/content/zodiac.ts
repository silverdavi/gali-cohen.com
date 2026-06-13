// Localized zodiac data: flattens zodiac.yaml (both languages per record) down
// to the active language, keyed by SignKey so components can look a sign up.
import { lang } from './index';
import { SIGN_ORDER, signRange, type SignKey } from '../lib/astro';
import zodiacFile from './zodiac.yaml';

const isHe = lang === 'he';

type RawSign = {
  symbol: string;
  nameHe: string; nameEn: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  traitHe: string; traitEn: string;
};
type RawFile = {
  signs: Record<SignKey, RawSign>;
  elements: Record<string, { he: string; en: string }>;
};

const raw = zodiacFile as RawFile;

// A localized month/day range label, e.g. "May 21 – Jun 20" / "21 במאי – 20 ביוני".
const md = new Intl.DateTimeFormat(isHe ? 'he-IL' : 'en-US', { month: 'short', day: 'numeric' });
function rangeLabel(sign: SignKey): string {
  const r = signRange(sign);
  const from = md.format(new Date(2025, r.from.m - 1, r.from.d));
  const to = md.format(new Date(2025, r.to.m - 1, r.to.d));
  return `${from} – ${to}`;
}

export type Sign = {
  key: SignKey;
  symbol: string;
  name: string;
  element: string;
  trait: string;
  range: string;
};

export const ZODIAC: Record<SignKey, Sign> = Object.fromEntries(
  SIGN_ORDER.map((key): [SignKey, Sign] => {
    const s = raw.signs[key];
    const el = raw.elements[s.element];
    return [key, {
      key,
      symbol: s.symbol,
      name: isHe ? s.nameHe : s.nameEn,
      element: isHe ? el.he : el.en,
      trait: isHe ? s.traitHe : s.traitEn,
      range: rangeLabel(key),
    }];
  }),
) as Record<SignKey, Sign>;

export const sign = (key: SignKey): Sign => ZODIAC[key];
