# galigeulacohen.com

Personal site for Gali Geula Cohen — holistic & emotional therapist, Tel Aviv. Modern-70s spiritual look: warm cream paper, terracotta accent, an arch-sun hero, a full-viewport **breathing** hero, a slowly turning dance circle, an ambient "living nature" layer (a bird that flies in, perches on a growing branch, and leaves), and a celestial **astrology** interlude (today's sun season + moon phase, plus a "find your sign" reveal). All copy is placeholder until Gali supplies her own words.

Built per `friends/guides/` (design-principles, anti-ai-slop, website-playbook, master-guide).

## Stack

Vite + React 19 + TypeScript, plain CSS custom properties in `src/index.css`, Framer Motion for reveals and scroll-driven motion. No UI framework, no CSS framework, no external script/style/font CDNs at runtime — everything is self-hosted and same-origin (this is also what lets the CSP below stay strict).

```bash
npm install
npm run dev      # local dev (HMR)
npm run build    # -> dist/  (also copies dist/index.html -> dist/404.html for SPA fallback)
npm run preview  # serve the production build locally
```

## Project structure

```
site/
├── index.html              # head: title, meta, OG/Twitter, JSON-LD, font preloads
├── vite.config.ts          # build-id stamp + build-time CSP/referrer meta injection
├── public/                 # copied verbatim to dist/
│   ├── CNAME               # galigeulacohen.com
│   ├── robots.txt          # crawl policy + sitemap pointer
│   ├── sitemap.xml         # single canonical URL (SPA)
│   ├── .well-known/security.txt   # RFC 9116 disclosure contact
│   ├── admin/              # Decap CMS (git-backed, noindex) — see CMS-SETUP.md
│   ├── fonts/ photos/ og.jpg favicon.svg apple-touch-icon.png
│   └── photos/nightsky.jpg # backdrop for the astrology section
└── src/
    ├── content/            # all copy: he.yaml (default) + en.yaml + typed loader
    │   ├── zodiac.yaml/.ts # localized sign names/elements/traits
    │   └── collections.ts  # pricing / events / store data
    ├── features.ts         # feature flags for every optional dynamic behavior
    ├── lib/astro.ts        # sun-sign, moon-phase + constellation geometry (pure)
    └── components/         # one file per section + the motion/ambient layers
```

## Content & languages

All copy lives in per-language YAML — never hard-coded in components:

- `src/content/he.yaml` — Hebrew (the default language)
- `src/content/en.yaml` — English (kept for a future language switch)
- `src/content/index.ts` — typed loader; `DEFAULT_LANG` picks the language and `main.tsx` sets `<html lang dir>`, so direction (RTL/LTR) follows automatically. The static `index.html` meta is Hebrew to match the default.

## Feature flags

Every optional dynamic behavior is gated in `src/features.ts` so anything can be disabled without touching component code — e.g. `breathDark`, `ambientLight`, `grain`, `kineticType`, `navWaves`, `photoHover`, `natureLife` (the bird), `astrology` / `astroMotion`, and the commerce sections `showPricing` / `showEvents` / `showStore`. All respect `prefers-reduced-motion`. Flags can be overridden per-visit via the URL query string for testing.

## Content editing (CMS)

`/admin` is [Decap CMS](https://decapcms.org/) — a git-backed, self-hosted editor. Edits commit to the repo and the GitHub Action rebuilds the site. The admin page is `noindex, nofollow` and loads Decap from a CDN, so it is intentionally **not** covered by the site's strict CSP. Full setup (GitHub OAuth, the Cloudflare auth worker) is in [`CMS-SETUP.md`](CMS-SETUP.md).

## SEO & discoverability

- **Per-page meta**: localized `<title>` + `description`, Open Graph + Twitter card (`og.jpg`, 1200×630), `theme-color`, `canonical`, `apple-touch-icon`.
- **Structured data**: `schema.org/Person` JSON-LD in `index.html` (name, alt name, job title, locality, languages).
- **`sitemap.xml` + `robots.txt`**: this is a single-page site, so the sitemap lists **one** canonical URL. The sections (practices, circle, about, astrology, contact…) are in-page anchors, not separate documents — they are deliberately not listed as distinct URLs. `robots.txt` allows all crawlers and points to the sitemap. Update `<lastmod>` in `sitemap.xml` on meaningful content changes.
- **No hreflang yet**: only Hebrew is published. When English ships on its own URL, add reciprocal `hreflang` tags.

### Conceptual IA / CTA funnel

The page is one scroll, ordered as a funnel: **Hero → Breath (experience) → Practices → Circle → About → [Pricing/Events/Shop] → Words (testimonials) → Astro → Contact**. Two primary CTAs both resolve to `#contact` (hero "Book a session", nav "Say hello"); the hero secondary points to `#practices`. The single conversion section (`#contact`) offers email (primary) plus WhatsApp + Instagram. Commerce sections only render when their flag is on **and** they have content, and the nav index numbers (01, 02…) are computed from exactly what's on the page, so they never drift. Known follow-ups for when real content lands: (1) WhatsApp is the dominant channel for an Israeli practice — consider promoting it to the primary contact action over `mailto:`; (2) the `wa.me` number and `hello@` address are placeholders; (3) consider whether the Astro delight interlude should sit *before* Words so testimonials stay adjacent to the final CTA.

## Security

The TLS and transport posture is hardened as far as the GitHub Pages + Route 53 stack allows, with the one structural limitation documented below.

**In place today**

- **HTTPS enforced** on GitHub Pages (`https_enforced: true`); HTTP redirects to HTTPS.
- **TLS 1.3** with a valid Let's Encrypt certificate (auto-renewed by GitHub/Fastly). SSL Labs-grade transport out of the box.
- **Content-Security-Policy** (browser-enforced) injected into the production HTML at build time by `vite.config.ts`. Scripts are strict (`'self'`, no inline, no `eval`); `'unsafe-inline'` is allowed for **styles only** (Framer Motion + inline style attributes). Everything else is same-origin (`img 'self' data:`, `font 'self'`, `connect 'self'`), with `object-src 'none'`, `frame-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests`. It is injected on **build only** — the dev server is skipped because Vite's HMR needs inline scripts / eval / a websocket that a strict CSP would block. Verified with a headless-Chrome smoke test: **zero CSP violations** on the production build.
- **Referrer-Policy** `strict-origin-when-cross-origin` via meta.
- **`/.well-known/security.txt`** (RFC 9116) for vulnerability disclosure.
- All external links use `rel="noopener noreferrer"`.

**Structural limitation — and how to reach an A+ header grade**

GitHub Pages cannot emit custom HTTP response headers. That means header-only protections — `Strict-Transport-Security` (HSTS), `X-Content-Type-Options`, `X-Frame-Options` / CSP `frame-ancestors`, `Permissions-Policy` — **cannot** be set on this hosting, and a header scanner (e.g. securityheaders.com) will not see the meta CSP. To pass those inspections, put a proxy/CDN in front of the apex (the account already uses Cloudflare for the CMS auth worker, so this is low-friction): proxy `galigeulacohen.com` through Cloudflare and add a response-header rule with:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: <same as the meta policy> ; frame-ancestors 'none'
```

Once HSTS is live and stable, submit the domain to <https://hstspreload.org>.

## Accessibility

Localized **skip-to-content** link (first focusable element → `#main`), a single `<main id="main">` landmark, visible focus rings, and every animation gated behind `prefers-reduced-motion`. Section glyphs/decorative SVGs are `aria-hidden`; the zodiac glyphs are forced to text presentation so they render as line-art, not colored emoji.

## Deploy

GitHub Pages via Actions (`.github/workflows/deploy.yml`). Custom domain `galigeulacohen.com` in `public/CNAME`; Route 53 zone lives in the DavidIAM AWS account. Each build stamps a UTC date + short git hash into the footer (`__BUILD_ID__`), so a deploy is verifiable live without guessing — read the small version string at the bottom of the page.

### Vanity domain redirect

`galigeula.com` (and `www.galigeula.com`) 301-redirect to `https://galigeulacohen.com`. GitHub Pages only allows one custom domain per repo, so the redirect is an AWS stack in the same account (`default` / "DavidIAM" profile, acct `302249171798`, us-east-1):

- S3 bucket `galigeula.com` — website config set to redirect-all to `galigeulacohen.com` over https (no objects).
- ACM cert for `galigeula.com` + `www.galigeula.com` (DNS-validated).
- CloudFront `E34ZHGKM99QQ8S` (`d1h0c9e1hs7hhv.cloudfront.net`) — S3 website origin (http-only), viewer protocol redirect-to-https, the ACM cert as SNI.
- Route 53 zone `galigeula.com` (`Z04649143KAPWML8RI117`): apex + `www` A/AAAA alias → the CloudFront distribution.
