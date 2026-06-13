# galigeulacohen.com

Personal site for Gali Geula Cohen — holistic & emotional therapist, Tel Aviv. Modern-70s spiritual look: warm cream paper, terracotta accent, arch-sun hero, a breathing circle, and a slowly turning dance circle. All copy is placeholder until Gali supplies her own words.

Built per `friends/guides/` (design-principles, anti-ai-slop, website-playbook).

## Stack

Vite + React 19 + TypeScript, plain CSS custom properties in `src/index.css`, Framer Motion for reveals only.

## Content & languages

All copy lives in per-language YAML files — never in components:

- `src/content/he.yaml` — Hebrew (the default language)
- `src/content/en.yaml` — English (kept for a future language switch)
- `src/content/index.ts` — typed loader; `DEFAULT_LANG` picks the language and `main.tsx` sets `<html lang dir>`, so the direction follows automatically. The static `index.html` meta is Hebrew to match.

```bash
npm install
npm run dev
npm run build   # -> dist/
```

## Deploy

GitHub Pages via Actions (`.github/workflows/deploy.yml`). Custom domain `galigeulacohen.com` in `public/CNAME`; Route 53 zone lives in the DavidIAM AWS account.
