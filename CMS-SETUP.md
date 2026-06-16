# Content admin (CMS) — setup & usage

The site is edited through **Decap CMS** at `/admin`. It is git-backed: every
save is a commit to this repo, and the existing GitHub Action rebuilds and
deploys the site automatically. No database, no server, ~$0/month.

The four editable collections — **Activities, Pricing, Events, Shop** — map to
`src/content/{activities,pricing,events,store}.yaml`. Each record holds both
Hebrew and English; the site shows whichever language is active.

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
The worker is in `cms-oauth-worker.js`. With the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/):

```bash
npm i -g wrangler
wrangler login
# create a worker named gali-cms-oauth, paste cms-oauth-worker.js as its code,
# then set the two secrets:
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler deploy
```

(You can also paste the worker code directly in the Cloudflare dashboard and add
the two variables there.)

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
