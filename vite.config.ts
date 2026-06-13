import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@rollup/plugin-yaml'
import { execSync } from 'node:child_process'

// Content-Security-Policy for the public site. Everything is same-origin: the
// bundle, the self-hosted fonts, the photos and the inline SVG/data-URI art.
// 'unsafe-inline' is needed only for STYLE (Framer Motion + inline style attrs);
// scripts stay strict ('self', no inline, no eval). Note: frame-ancestors / HSTS
// / X-Content-Type-Options are HTTP-header-only and ignored in a <meta> CSP —
// those require a proxy in front of GitHub Pages (see README → Security).
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "img-src 'self' data:",
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
  plugins: [react(), yaml(), securityMeta()],
})
