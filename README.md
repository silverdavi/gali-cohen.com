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

### Vanity domain redirect

`galigeula.com` (and `www.galigeula.com`) 301-redirect to `https://galigeulacohen.com`. GitHub Pages only allows one custom domain per repo, so the redirect is an AWS stack in the same account (`default` / "DavidIAM" profile, acct `302249171798`, us-east-1):

- S3 bucket `galigeula.com` — website config set to redirect-all to `galigeulacohen.com` over https (no objects).
- ACM cert for `galigeula.com` + `www.galigeula.com` (DNS-validated).
- CloudFront `E34ZHGKM99QQ8S` (`d1h0c9e1hs7hhv.cloudfront.net`) — S3 website origin (http-only), viewer protocol redirect-to-https, the ACM cert as SNI.
- Route 53 zone `galigeula.com` (`Z04649143KAPWML8RI117`): apex + `www` A/AAAA alias → the CloudFront distribution.
