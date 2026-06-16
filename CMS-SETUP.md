# Content admin (CMS) — setup & usage

The site is edited through **Decap CMS** at `/admin`. It is git-backed: every
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

> Safety note: the **Site text** form models every field on purpose. Decap
> rewrites the whole file on save, so a partial model would silently delete the
> unlisted blocks (story, sky widget, etc.). If you add a new section to
> `he.yaml`, add its fields here too.

---

## Option A — edit locally (no login, fastest)

Best for David / anyone with the repo checked out.

```bash
npm run dev                # terminal 1 — serves the site + /admin
npx decap-server           # terminal 2 — local git bridge
```

Open <http://localhost:5173/admin/> and choose **“Work with local repository.”**
Edits write straight to the YAML files. Then:

```bash
git add -A && git commit -m "content: update events" && git push
```

The push triggers the deploy. Done.

---

## Option B — edit live at galigeula.com/admin (GitHub login)

This is for a non-developer editing from anywhere. It needs a tiny OAuth helper
because GitHub Pages can’t run server code. One-time setup (~10 min):

### 1. Create a GitHub OAuth App
GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App
- Application name: `Gali CMS`
- Homepage URL: `https://galigeula.com`
- Authorization callback URL: `https://gali-cms-oauth.<your-subdomain>.workers.dev/callback`

Copy the **Client ID** and generate a **Client Secret**.

### 2. Deploy the OAuth helper (Cloudflare Workers, free)
The worker (`cms-oauth-worker.js`) and its `wrangler.toml` are already in the repo,
so from the `site/` folder it's three commands:

```bash
npm i -g wrangler
wrangler login                     # opens a browser, free Cloudflare account
wrangler secret put GITHUB_CLIENT_ID      # paste the Client ID from step 1
wrangler secret put GITHUB_CLIENT_SECRET  # paste the Client Secret from step 1
wrangler deploy                    # prints your https://gali-cms-oauth.<sub>.workers.dev URL
```

Use that printed URL as the callback host in step 1 and the `base_url` in step 3.
(You can also paste the worker code + the two variables in the Cloudflare dashboard.)

### 3. Point the CMS at the helper
In `public/admin/config.yml`, uncomment and set:

```yaml
backend:
  name: github
  repo: silverdavi/gali-cohen.com
  branch: main
  base_url: https://gali-cms-oauth.<your-subdomain>.workers.dev
```

Commit + push. Now <https://galigeula.com/admin> shows **“Login with
GitHub.”** The editor must be a collaborator on the repo (Settings → Collaborators).

---

## Store payments

Store and pricing items have an optional link field (`Buy link` / `Checkout`).
The recommended, no-backend option is **Stripe Payment Links**:

1. Stripe Dashboard → Products → create a product/price.
2. Create a **Payment Link** for it (Stripe-hosted checkout).
3. Paste that URL into the item’s link field in the CMS.

If the field is left empty, the button falls back to **WhatsApp** (the number in
`profile.whatsapp`) so it always goes somewhere useful. PayPal.me links or any
booking URL work the same way.

---

## Adding a new editable section later
1. Add a `src/content/<thing>.yaml` (bilingual fields like the others).
2. Map it in `src/content/collections.ts`.
3. Render it in a component and add it to `App.tsx`.
4. Add a matching `files` collection in `public/admin/config.yml` — **model
   every field**, because Decap drops fields it doesn’t know about on save.
