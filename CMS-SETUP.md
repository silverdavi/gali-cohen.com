# Content admin (CMS) — setup & usage

The site is edited through **Sveltia CMS** at `/admin` (a drop-in, faster
replacement for Decap/Netlify CMS, same `config.yml`). It is git-backed: every
save is a commit to this repo, and the existing GitHub Action rebuilds and
deploys the site automatically. No database, no server, ~$0/month.

What's editable in `/admin`:

| Collection | File | What it controls |
|---|---|---|
| **Contact & social** | `src/content/site.yaml` | Email, Instagram, WhatsApp — one place, used site-wide (incl. the fallback for every Buy/Reserve button) |
| **Activities** | `src/content/activities.yaml` | The "ways to work together" cards |
| **Pricing** | `src/content/pricing.yaml` | Session prices + booking links |
| **Events** | `src/content/events.yaml` | Upcoming events (date, place, sign-up link) |
| **Shop** | `src/content/store.yaml` | Products, prices, buy links |
| **Site text** | `src/content/he.yaml` | All page copy: hero, breath, about, the talk, testimonials, the sky widget labels, contact text, footer |

The commerce collections hold both Hebrew and English per record; **Site text** is
the live (Hebrew) copy. `en.yaml` stays developer-maintained until an English
toggle ships.

> Safety note: the **Site text** form models every field on purpose. A git-backed
> CMS rewrites the whole file on save, so a partial model would silently delete
> the unlisted blocks (story, sky widget, etc.). If you add a new section to
> `he.yaml`, add its fields here too.

---

## "Login" — what the password actually is

A static site on GitHub Pages has no server, so there's no place to safely keep a
username/password that can write commits. Instead, **the login credential is a
GitHub token** — you paste it once and the browser remembers it, so day to day it
behaves exactly like a saved password. This is the simplest thing that can both
*log you in* and *save your edits* with zero infrastructure.

### Edit live at galigeula.com/admin (recommended, no setup)

1. Open <https://galigeula.com/admin>.
2. Click **“Sign In Using Access Token.”**
3. The dialog has a link to GitHub with the right permissions pre-selected.
   Click it, create the token (a fine-grained token, **Contents: Read and write**
   on the `gali-cohen.com` repo, is enough), and copy it.
4. Paste the token into the dialog. You're in. The browser stores it, so you
   won't be asked again on that device.

The GitHub account you make the token from must have write access to the repo
(owner, or added under **Settings → Collaborators**). Give the token an
expiration you're comfortable with (e.g. 1 year); when it expires, repeat steps
2–4 with a fresh one.

> Treat the token like a password — anyone with it can edit the site. That's the
> tradeoff for a no-server setup, and it's fine for a one-person site.

### Edit locally (no token at all — for David)

Sveltia reads/writes local files directly through the browser (Chromium: Chrome,
Edge, Brave — Safari/Firefox don't support the file API).

```bash
npm run dev                # serves the site + /admin
```

Open <http://localhost:5173/admin/>, click **“Work with Local Repository,”** pick
the repo folder once, and edit. Changes write straight to the YAML files. Then:

```bash
git add -A && git commit -m "content: update events" && git push
```

The push triggers the deploy. (No `decap-server`/proxy needed — Sveltia dropped
that in favor of the native file API.)

---

## Optional: one-click “Login with GitHub” (no token to paste)

If you'd rather click a button than paste a token, you can add a tiny OAuth
helper. It's free but takes ~10 min and a Cloudflare account.

### 1. Create a GitHub OAuth App
GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App
- Application name: `Gali CMS`
- Homepage URL: `https://galigeula.com`
- Authorization callback URL: `https://gali-cms-oauth.<your-subdomain>.workers.dev/callback`

Copy the **Client ID** and generate a **Client Secret**.

### 2. Deploy the OAuth helper (Cloudflare Workers, free)
The worker (`cms-oauth-worker.js`) and its `wrangler.toml` are in the repo, so
from the `site/` folder it's a few commands:

```bash
npm i -g wrangler
wrangler login                            # free Cloudflare account
wrangler secret put GITHUB_CLIENT_ID      # paste Client ID from step 1
wrangler secret put GITHUB_CLIENT_SECRET  # paste Client Secret from step 1
wrangler deploy                           # prints your workers.dev URL
```

### 3. Point the CMS at the helper
In `public/admin/config.yml`, under `backend:`, set `base_url` and allow OAuth:

```yaml
backend:
  name: github
  repo: silverdavi/gali-cohen.com
  branch: main
  auth_methods: [oauth, token]
  base_url: https://gali-cms-oauth.<your-subdomain>.workers.dev
```

Commit + push. `/admin` now shows **“Sign In with GitHub.”** The editor must be a
collaborator on the repo.

---

## Store payments

Store and pricing items have an optional link field (`Buy link` / `Checkout`).
The recommended, no-backend option is **Stripe Payment Links**:

1. Stripe Dashboard → Products → create a product/price.
2. Create a **Payment Link** for it (Stripe-hosted checkout).
3. Paste that URL into the item's link field in the CMS.

If the field is left empty, the button falls back to **WhatsApp** (the number in
`site.yaml`) so it always goes somewhere useful. PayPal.me links or any booking
URL work the same way.

---

## Adding a new editable section later
1. Add a `src/content/<thing>.yaml` (bilingual fields like the others).
2. Map it in `src/content/collections.ts`.
3. Render it in a component and add it to `App.tsx`.
4. Add a matching `files` collection in `public/admin/config.yml` — **model
   every field**, because a git-backed CMS drops fields it doesn't know about on save.
