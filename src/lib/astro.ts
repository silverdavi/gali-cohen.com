// Astrology logic — pure, framework-free, and fully client-side.
//
// Two computations power the widget:
//   1. the tropical sun sign for a given calendar day (zodiac "season"), and
//   2. the moon's phase for a given moment (illuminated fraction + named phase).
// Plus stylized vector geometry for each constellation (gold line-art). None of
// this is translatable copy — names/traits live in zodiac.yaml; this file is
// data + math only.

export type SignKey =
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export const SIGN_ORDER: SignKey[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

// Tropical sun-sign boundaries. Each entry: the sign that BEGINS on [month, day]
// (1-indexed month). Ordered through the year from Capricorn's late-Dec start.
const BOUNDARIES: { sign: SignKey; month: number; day: number }[] = [
  { sign: 'capricorn', month: 12, day: 22 },
  { sign: 'aquarius', month: 1, day: 20 },
  { sign: 'pisces', month: 2, day: 19 },
  { sign: 'aries', month: 3, day: 21 },
  { sign: 'taurus', month: 4, day: 20 },
  { sign: 'gemini', month: 5, day: 21 },
  { sign: 'cancer', month: 6, day: 21 },
  { sign: 'leo', month: 7, day: 23 },
  { sign: 'virgo', month: 8, day: 23 },
  { sign: 'libra', month: 9, day: 23 },
  { sign: 'scorpio', month: 10, day: 23 },
  { sign: 'sagittarius', month: 11, day: 22 },
];

/** Sun sign for a 1-indexed month + day. */
export function sunSign(month: number, day: number): SignKey {
  // Walk the year; the sign is the latest boundary at or before the date.
  // Capricorn wraps the new year, so default to it.
  let current: SignKey = 'capricorn';
  for (const b of BOUNDARIES) {
    if (month > b.month || (month === b.month && day >= b.day)) {
      // capricorn's Dec start only applies in December
      if (b.sign === 'capricorn' && month !== 12) continue;
      current = b.sign;
    }
  }
  // Handle early-January (before Jan 20) -> Capricorn (already default), and
  // ensure December before the 22nd stays Sagittarius.
  if (month === 12 && day < 22) current = 'sagittarius';
  return current;
}

export const sunSignForDate = (d = new Date()): SignKey =>
  sunSign(d.getMonth() + 1, d.getDate());

/** The inclusive [start, end] (month/day) range a sign occupies, for labels. */
export function signRange(sign: SignKey): { from: { m: number; d: number }; to: { m: number; d: number } } {
  const i = BOUNDARIES.findIndex((b) => b.sign === sign);
  const start = BOUNDARIES[i];
  const next = BOUNDARIES[(i + 1) % BOUNDARIES.length];
  // end is the day before the next sign begins
  const end = new Date(2025, next.month - 1, next.day);
  end.setDate(end.getDate() - 1);
  return { from: { m: start.month, d: start.day }, to: { m: end.getMonth() + 1, d: end.getDate() } };
}

// --- Moon phase ------------------------------------------------------------
const SYNODIC = 29.530588853; // mean length of a lunation, days
// A known new moon: 2000-01-06 18:14 UTC, expressed as a Julian Date.
const KNOWN_NEW_JD = 2451550.1;

function toJD(d: Date): number {
  return d.getTime() / 86400000 + 2440587.5;
}

export type MoonPhaseName =
  | 'new' | 'waxingCrescent' | 'firstQuarter' | 'waxingGibbous'
  | 'full' | 'waningGibbous' | 'lastQuarter' | 'waningCrescent';

export type Moon = {
  /** 0=new, 0.25=first quarter, 0.5=full, 0.75=last quarter */
  phase: number;
  /** illuminated fraction 0..1 */
  illumination: number;
  name: MoonPhaseName;
  waxing: boolean;
};

export function moonPhase(d = new Date()): Moon {
  let phase = ((toJD(d) - KNOWN_NEW_JD) % SYNODIC) / SYNODIC;
  if (phase < 0) phase += 1;
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const waxing = phase < 0.5;
  // Name buckets: 8 phases, with tight windows for the four exact moments.
  const e = 0.035; // how close counts as an "exact" quarter/new/full
  let name: MoonPhaseName;
  if (phase < e || phase > 1 - e) name = 'new';
  else if (Math.abs(phase - 0.25) < e) name = 'firstQuarter';
  else if (Math.abs(phase - 0.5) < e) name = 'full';
  else if (Math.abs(phase - 0.75) < e) name = 'lastQuarter';
  else if (phase < 0.25) name = 'waxingCrescent';
  else if (phase < 0.5) name = 'waxingGibbous';
  else if (phase < 0.75) name = 'waningGibbous';
  else name = 'waningCrescent';
  return { phase, illumination, name, waxing };
}

/** SVG path (centered at 0,0) describing the lit portion of the moon. */
export function moonLitPath(R: number, phase: number): string {
  const c = Math.cos(2 * Math.PI * phase); // +1 new, 0 quarters, -1 full
  const rx = R * Math.abs(c);
  const waxing = phase < 0.5;
  const outerSweep = waxing ? 1 : 0;
  const innerSweep = waxing ? (c > 0 ? 0 : 1) : (c > 0 ? 1 : 0);
  return `M0 ${-R} A ${R} ${R} 0 0 ${outerSweep} 0 ${R} A ${rx} ${R} 0 0 ${innerSweep} 0 ${-R} Z`;
}

// --- Constellation geometry (stylized line-art) ----------------------------
// Each constellation lives in a 100×100 box (y downward). `stars` are points;
// `lines` connect star indices. Recolored via currentColor at render time.
export type Constellation = { stars: [number, number][]; lines: [number, number][] };

export const CONSTELLATIONS: Record<SignKey, Constellation> = {
  aries: { stars: [[18, 68], [40, 54], [60, 47], [82, 50]], lines: [[0, 1], [1, 2], [2, 3]] },
  taurus: {
    stars: [[18, 66], [38, 54], [56, 46], [55, 64], [78, 34], [80, 72]],
    lines: [[0, 1], [1, 2], [1, 3], [2, 4], [3, 5]],
  },
  gemini: {
    stars: [[30, 18], [33, 42], [36, 72], [62, 16], [66, 42], [70, 74]],
    lines: [[0, 1], [1, 2], [3, 4], [4, 5], [0, 3], [2, 5]],
  },
  cancer: { stars: [[50, 22], [50, 48], [28, 70], [72, 72]], lines: [[0, 1], [1, 2], [1, 3]] },
  leo: {
    stars: [[18, 34], [26, 48], [40, 52], [54, 46], [50, 30], [82, 58], [60, 76]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6], [6, 2]],
  },
  virgo: {
    stars: [[14, 34], [34, 44], [54, 40], [50, 20], [62, 60], [82, 70]],
    lines: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5]],
  },
  libra: { stars: [[50, 22], [30, 46], [70, 46], [22, 64], [78, 64]], lines: [[0, 1], [0, 2], [1, 3], [2, 4]] },
  scorpio: {
    stars: [[18, 30], [30, 36], [42, 42], [54, 46], [64, 56], [70, 70], [60, 80], [48, 78]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]],
  },
  sagittarius: {
    stars: [[18, 76], [44, 56], [70, 36], [58, 30], [74, 48], [34, 42], [40, 68]],
    lines: [[0, 1], [1, 2], [2, 3], [2, 4], [5, 6]],
  },
  capricorn: {
    stars: [[18, 42], [50, 28], [80, 44], [62, 72], [34, 68]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
  },
  aquarius: {
    stars: [[14, 40], [30, 52], [46, 40], [62, 52], [78, 40], [60, 66], [50, 80]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6]],
  },
  pisces: {
    stars: [[16, 30], [34, 44], [52, 54], [68, 44], [84, 30], [12, 18], [88, 18]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [4, 6]],
  },
};
