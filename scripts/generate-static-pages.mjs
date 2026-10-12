// Runs after `vite build` (see package.json). Validates CMS content (fails
// the build loudly on a bad edit), then emits one dist/<route>/index.html per
// entity — same bundle, different <head> — so a shared workshop/article/
// episode/product link unfurls correctly on WhatsApp/Facebook and is
// crawlable, since link-unfurlers read the raw HTML response and never run
// JS. Also rewrites dist/sitemap.xml to list every generated route.
//
// Loads the app's own TS modules (including .yaml imports, via the project's
// @rollup/plugin-yaml Vite plugin) through Vite's programmatic SSR API —
// same parsed/mapped domain objects the React app uses, zero duplicated
// mapping logic, zero extra YAML-parsing dependency.
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://galigeula.com';

const PERSON = {
  '@type': 'Person',
  name: 'Gali Geula Cohen',
  alternateName: 'גלי גאולה כהן',
  url: `${SITE_URL}/`,
};

// Routes owned by the app itself (no entity slug) — the collision check below
// guards against a CMS slug accidentally matching one of these, e.g. a
// workshop slugged "services". The three legal pages are NOT in this set:
// they're deliberately in the generated `routes` list below (each needs its
// own real title too), not left to the plain index.html fallback.
const STATIC_ROUTES = new Set(['/', '/services', '/workshops', '/about', '/blog', '/podcast', '/videos', '/store']);

const escapeAttr = (s) => String(s ?? '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const escapeHtml = (s) => String(s ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function injectHead(template, route) {
  const fullUrl = `${SITE_URL}${route.path}/`;
  const imageUrl = route.image
    ? (route.image.startsWith('http') ? route.image : `${SITE_URL}${route.image}`)
    : `${SITE_URL}/og-v2.jpg`;
  const description = route.description || '';

  let html = template;
  const replacements = [
    [/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`],
    [/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeAttr(description)}" />`],
    [/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${fullUrl}" />`],
    [/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${fullUrl}" />`],
    [/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeAttr(route.title)}" />`],
    [/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeAttr(description)}" />`],
    [/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${imageUrl}" />`],
    [/<meta property="og:image:alt" content="[^"]*"\s*\/>/, `<meta property="og:image:alt" content="${escapeAttr(route.imageAlt || route.title)}" />`],
    [/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`],
    [/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeAttr(description)}" />`],
    [/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${imageUrl}" />`],
  ];
  for (const [pattern, replacement] of replacements) {
    if (!pattern.test(html)) throw new Error(`Template tag not found for pattern ${pattern} while generating ${route.path}`);
    html = html.replace(pattern, replacement);
  }
  if (route.jsonLd) {
    html = html.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">\n${JSON.stringify(route.jsonLd, null, 2)}\n</script>`,
    );
  }
  return html;
}

async function main() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('dist/index.html not found — run `vite build` before this script.');
    process.exit(1);
  }

  const server = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { validateContent } = await server.ssrLoadModule('/src/cms/validation.ts');
    try {
      validateContent();
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
      process.exitCode = 1;
      return;
    }

    const q = await server.ssrLoadModule('/src/cms/queries.ts');
    const { legal, content } = await server.ssrLoadModule('/src/content/index.ts');
    const sectionOn = (key) => content.sections?.[key]?.enabled !== false;

    const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
    /** @type {{path: string, title: string, description?: string, image?: string, jsonLd?: object}[]} */
    const routes = [];

    for (const key of ['accessibility', 'privacy', 'terms']) {
      const page = legal[key];
      routes.push({
        path: `/${key}`,
        title: `${page.title} · גלי גאולה כהן`,
        description: page.body.slice(0, 160),
      });
    }

    routes.push({
      path: '/contact',
      title: `${content.nav.contact} · גלי גאולה כהן`,
      description: content.contact.sub,
    });

    for (const cat of q.getAllServiceCategories()) {
      routes.push({
        path: `/services/${cat.slug}`,
        title: `${cat.title} · גלי גאולה כהן`,
        description: cat.metaDescription || cat.shortDesc,
        image: cat.photo,
      });
    }

    for (const w of q.getAllWorkshops()) {
      if (!w.slug) continue;
      const share = q.workshopShareMeta(w);
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: w.title,
        startDate: w.time ? `${w.iso}T${w.time}` : w.iso,
        ...(w.endTime ? { endDate: `${w.iso}T${w.endTime}` } : {}),
        eventStatus: w.status === 'cancelled' ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
        location: { '@type': 'Place', name: w.location || 'Tel Aviv' },
        ...(w.image ? { image: `${SITE_URL}${w.image}` } : {}),
        organizer: PERSON,
        // Never fabricate a price for a "contact for price" workshop.
        ...(w.price.type === 'fixed' && w.price.amount != null
          ? { offers: { '@type': 'Offer', price: w.price.amount, priceCurrency: w.price.currency, url: `${SITE_URL}/workshops/${w.slug}/` } }
          : {}),
      };
      routes.push({
        path: `/workshops/${w.slug}`,
        title: share.title,
        description: share.description,
        image: w.image,
        imageAlt: w.title,
        jsonLd,
      });
    }

    for (const a of sectionOn('blog') ? q.getAllArticles() : []) {
      if (!a.slug) continue;
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: a.title,
        ...(a.dateISO ? { datePublished: a.dateISO } : {}),
        ...(a.image ? { image: `${SITE_URL}${a.image}` } : {}),
        author: PERSON,
      };
      routes.push({ path: `/blog/${a.slug}`, title: `${a.title} · גלי גאולה כהן`, description: a.excerpt, image: a.image, jsonLd });
    }

    for (const s of sectionOn('podcast') ? q.getAllShows() : []) {
      if (!s.slug) continue;
      routes.push({
        path: `/podcast/${s.slug}`,
        title: `${s.name} · פודקאסט · גלי גאולה כהן`,
        description: s.desc,
        image: s.coverImage,
      });
      for (const ep of s.episodes) {
        if (!ep.slug) continue;
        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'PodcastEpisode',
          name: ep.title,
          ...(ep.publishedDate ? { datePublished: ep.publishedDate } : {}),
          ...(ep.durationMinutes ? { duration: `PT${ep.durationMinutes}M` } : {}),
          partOfSeries: { '@type': 'PodcastSeries', name: s.name },
        };
        routes.push({
          path: `/podcast/${s.slug}/${ep.slug}`,
          title: `${ep.title} · ${s.name} · גלי גאולה כהן`,
          description: ep.desc,
          image: ep.coverImage || s.coverImage,
          jsonLd,
        });
      }
    }

    for (const v of sectionOn('videos') ? q.getAllVideos() : []) {
      if (!v.slug) continue;
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: v.title,
        description: v.desc,
        ...(v.thumbnail ? { thumbnailUrl: v.thumbnail } : {}),
        ...(v.publishedDate ? { uploadDate: v.publishedDate } : {}),
      };
      routes.push({
        path: `/videos/${v.slug}`,
        title: `${v.title} · גלי גאולה כהן`,
        description: v.metaDescription || v.desc,
        image: v.thumbnail,
        jsonLd,
      });
    }

    for (const p of sectionOn('store') ? q.getAllProducts() : []) {
      if (!p.slug) continue;
      const effectivePrice = p.salePrice ?? p.price;
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.title,
        description: p.desc,
        ...(p.image ? { image: `${SITE_URL}${p.image}` } : {}),
        offers: { '@type': 'Offer', price: effectivePrice, priceCurrency: p.currency, url: `${SITE_URL}/store/${p.slug}/` },
      };
      routes.push({ path: `/store/${p.slug}`, title: `${p.title} · חנות · גלי גאולה כהן`, description: p.desc, image: p.image, jsonLd });
    }

    // Hub pages have no slug of their own. Without a real index.html, GitHub
    // Pages redirects /services to /services/ (because child pages exist) and
    // then 404s. Each one gets the same title the React page sets after JS.
    const plain = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
    const hubs = [
      {
        path: '/about',
        title: `${content.aboutSection.title} · גלי גאולה כהן`,
        description: plain(content.aboutSection.paragraphs[0]).slice(0, 160),
        sitemap: true,
      },
      {
        path: '/services',
        title: `${q.servicesHeading.title} · גלי גאולה כהן`,
        description: q.servicesHeading.sub || content.meta.description,
        sitemap: true,
      },
      {
        path: '/workshops',
        title: `${q.workshopsHeading.title} · גלי גאולה כהן`,
        description: q.workshopsHeading.sub || content.meta.description,
        sitemap: q.getAllWorkshops().length > 0,
      },
      ...(sectionOn('podcast') ? [{
        path: '/podcast',
        title: `${q.podcastHeading.title} · גלי גאולה כהן`,
        description: q.podcastHeading.sub,
        sitemap: q.getAllShows().length > 0,
      }] : []),
      ...(sectionOn('store') ? [{
        path: '/store',
        title: `${q.storeHeading.title} · גלי גאולה כהן`,
        description: q.storeHeading.sub,
        sitemap: q.getAllProducts().length > 0,
      }] : []),
      ...(sectionOn('blog') ? [{
        path: '/blog',
        title: `${q.blogHeading.title} · גלי גאולה כהן`,
        description: q.blogHeading.sub,
        sitemap: q.getAllArticles().length > 0,
      }] : []),
      ...(sectionOn('videos') ? [{
        path: '/videos',
        title: `${q.videosHeading.title} · גלי גאולה כהן`,
        description: q.videosHeading.sub,
        sitemap: q.getAllVideos().length > 0,
      }] : []),
    ];

    // Fail loudly on a route colliding with a static route, or two entities
    // racing for the same generated path (cache.ts already guards per-entity
    // slug uniqueness — this is the cross-entity-type check on top of that).
    const seen = new Set();
    for (const r of routes) {
      if (STATIC_ROUTES.has(r.path)) {
        throw new Error(`Generated route "${r.path}" collides with a static app route.`);
      }
      if (seen.has(r.path)) {
        throw new Error(`Duplicate generated route "${r.path}".`);
      }
      seen.add(r.path);
    }
    for (const hub of hubs) {
      if (seen.has(hub.path)) throw new Error(`Duplicate generated route "${hub.path}".`);
      seen.add(hub.path);
    }

    const pages = [...routes, ...hubs];
    for (const route of pages) {
      const html = injectHead(template, route);
      const dir = path.join(DIST, route.path.replace(/^\//, ''));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), html);
    }

    // Empty sections (no articles, no videos) still have an HTML file so a
    // direct visit is HTTP 200, but they are not advertised to crawlers.
    const sitemapPaths = ['/', ...pages.filter((p) => p.sitemap !== false).map((p) => p.path)];
    const sitemap =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      sitemapPaths.map((p) => `  <url><loc>${SITE_URL}${p === '/' ? '/' : `${p}/`}</loc></url>`).join('\n') +
      '\n</urlset>\n';
    fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);

    console.log(`generate-static-pages: wrote ${pages.length} pages + sitemap.xml (${sitemapPaths.length} URLs).`);
  } finally {
    await server.close();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack : err);
  process.exitCode = 1;
});
