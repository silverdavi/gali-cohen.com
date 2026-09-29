// Build-time content validation. Every check here throws (which fails the
// build) rather than warns — a bad CMS edit should surface as a clear,
// immediate build failure, not a partially-broken deploy. Called from a Vite
// `buildStart` hook (vite.config.ts) so it fails before any bundling work is
// spent, and again by the static-generation script as a second gate.
import { serviceCategories } from './cache';
import { workshops, articles, podcastShows, videos, products } from './cache';

const WORKSHOP_STATUSES = ['draft', 'upcoming', 'sold-out', 'completed', 'cancelled'];
const VIDEO_PROVIDERS = ['youtube', 'vimeo', 'external'];

function fail(errors: string[]): never {
  throw new Error(`Content validation failed:\n  - ${errors.join('\n  - ')}`);
}

export function validateContent(): void {
  const errors: string[] = [];

  // Services: category slugs unique (cache.ts's Map building already throws on
  // that), every track's price internally consistent.
  for (const cat of serviceCategories) {
    for (const track of cat.tracks) {
      if (track.price.type === 'fixed' && (track.price.amount == null || track.price.amount < 0)) {
        errors.push(`Service "${cat.slug}" / "${track.title}": priceType is "fixed" but price is not a valid number.`);
      }
      if (track.price.type === 'contact' && track.price.amount != null) {
        errors.push(`Service "${cat.slug}" / "${track.title}": priceType is "contact" but price is set — should be null.`);
      }
    }
  }

  // Workshops
  for (const w of workshops) {
    if (!w.slug) errors.push(`Workshop "${w.title}" is missing a slug.`);
    if (!w.title) errors.push('A workshop is missing a title.');
    if (!w.iso || Number.isNaN(new Date(w.iso).getTime())) {
      errors.push(`Workshop "${w.slug || w.title}" has an invalid date ("${w.iso}").`);
    }
    if (!WORKSHOP_STATUSES.includes(w.status)) {
      errors.push(`Workshop "${w.slug}" has an invalid status "${w.status}" (expected one of ${WORKSHOP_STATUSES.join(', ')}).`);
    }
    if (w.price.type === 'fixed' && (w.price.amount == null || w.price.amount < 0)) {
      errors.push(`Workshop "${w.slug}": priceType is "fixed" but price is not a valid number.`);
    }
  }

  // Articles
  for (const a of articles) {
    if (!a.slug) errors.push(`Article "${a.title}" is missing a slug.`);
    if (!a.title) errors.push('An article is missing a title.');
    if (a.dateISO && Number.isNaN(new Date(a.dateISO).getTime())) {
      errors.push(`Article "${a.slug}" has an invalid dateISO ("${a.dateISO}").`);
    }
  }

  // Podcast — episode slug uniqueness *within* a show; cache.ts already throws on
  // duplicate show slugs and duplicate show/episode pairs, so this only adds the
  // field-level checks cache.ts doesn't do.
  for (const show of podcastShows) {
    for (const ep of show.episodes) {
      if (!ep.slug) errors.push(`An episode of show "${show.slug}" is missing a slug.`);
    }
  }

  // Videos
  for (const v of videos) {
    if (!v.slug) errors.push(`A video ("${v.title}") is missing a slug.`);
    if (!VIDEO_PROVIDERS.includes(v.provider)) {
      errors.push(`Video "${v.slug}" has an invalid provider "${v.provider}" (expected one of ${VIDEO_PROVIDERS.join(', ')}).`);
    }
    if ((v.provider === 'youtube' || v.provider === 'vimeo') && !v.videoId) {
      errors.push(`Video "${v.slug}" has provider "${v.provider}" but no videoId.`);
    }
    if (v.provider === 'external' && !v.videoUrl) {
      errors.push(`Video "${v.slug}" has provider "external" but no videoUrl.`);
    }
  }

  // Products — slug uniqueness (where present) already enforced by cache.ts
  for (const p of products) {
    if (p.price < 0) errors.push(`Product "${p.title}": price must be >= 0.`);
    if (p.salePrice != null && (p.salePrice < 0 || p.salePrice > p.price)) {
      errors.push(`Product "${p.title}": salePrice must be between 0 and price (got salePrice=${p.salePrice}, price=${p.price}).`);
    }
  }

  if (errors.length > 0) fail(errors);
}
