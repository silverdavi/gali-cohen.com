import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@rollup/plugin-yaml'
import { execSync } from 'node:child_process'

// Content-Security-Policy for the public site. Everything is same-origin: the
// bundle, the self-hosted fonts, the photos and the inline SVG/data-URI art —
// with two deliberate exceptions, both for the podcast player: it embeds
// YouTube inline (youtube-nocookie.com, the privacy-enhanced domain — no
// tracking cookie until the viewer actually presses play) instead of sending
// listeners off-site, and the show card shows that video's real thumbnail
// (i.ytimg.com, YouTube's static thumbnail CDN — a plain image fetch, no
// script). 'unsafe-inline' is needed only for STYLE (Framer Motion + inline
// style attrs); scripts stay strict ('self', no inline, no eval). Note:
// frame-ancestors / HSTS / X-Content-Type-Options are HTTP-header-only and
// ignored in a <meta> CSP — those require a proxy in front of GitHub Pages
// (see README → Security).
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src https://www.youtube-nocookie.com",
  "img-src 'self' data: https://i.ytimg.com",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ')

// Inject security meta tags into index.html for the production BUILD only. The
// dev server is skipped on purpose: Vite's HMR uses inline scripts, eval and a
// websocket that a strict CSP would block.
function securityMeta(): Plugin {
  return {
    name: 'security-meta',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (ctx.server) return html // dev server → leave untouched
        const tags =
          `    <meta http-equiv="Content-Security-Policy" content="${CSP}" />\n` +
          `    <meta name="referrer" content="strict-origin-when-cross-origin" />\n`
        return html.replace('</head>', `${tags}  </head>`)
      },
    },
  }
}

// public/admin/index.html (the CMS) only serves correctly at that exact path.
// Vite's own SPA index-fallback middleware intercepts extension-less requests
// like /admin or /admin/ first and serves the site's root index.html instead —
// so without this, the CMS setup instructions (open .../admin/) silently load
// the wrong page in dev. Rewriting the URL before Vite's internal middleware
// runs lets its normal static "public" serving pick up the real admin page.
function adminIndexFallback(): Plugin {
  return {
    name: 'admin-index-fallback',
    configureServer: {
      order: 'pre',
      handler(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin/index.html'
          next()
        })
      },
    },
  }
}

// Build stamp so a deploy is verifiable from the live footer: short git hash +
// UTC build date. Falls back gracefully if git isn't available (e.g. CI shallow
// clone without history).
function buildId() {
  let hash = 'nogit'
  try {
    hash = execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    /* no git context */
  }
  const date = new Date().toISOString().slice(0, 16).replace('T', ' ')
  return `${date}Z · ${hash}`
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BUILD_ID__: JSON.stringify(buildId()),
  },
  plugins: [react(), yaml(), securityMeta(), adminIndexFallback()],
  server: {
    // Vite blocks any Host header it doesn't recognize (DNS-rebinding guard),
    // which otherwise rejects an ngrok tunnel outright. ngrok's free tier hands
    // out a new random subdomain each run, so allow the whole suffix rather
    // than one hardcoded URL that would break on the next `ngrok http 5173`.
    allowedHosts: ['.ngrok-free.app', '.ngrok.io', '.ngrok.app'],
  },
})
