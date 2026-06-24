// Self-contained screenshotter: serves ./dist, opens headless Chrome, captures
// the hero and a few section anchors to /tmp/gali-shots. Used to eyeball the real
// photos + the new story section after the asset swap.
import { spawn } from 'node:child_process';
import http from 'node:http';
import { createReadStream, existsSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9223, HTTP_PORT = 4323;
const DIST = join(process.cwd(), 'dist');
const OUT = '/tmp/gali-shots';
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MIME = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.xml':'application/xml','.txt':'text/plain','.webm':'video/webm','.mp4':'video/mp4' };

function startServer() {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/') p = '/index.html';
    let file = join(DIST, p);
    if (!existsSync(file) || statSync(file).isDirectory()) file = join(DIST, 'index.html');
    res.setHeader('Content-Type', MIME[extname(file)] || 'application/octet-stream');
    createReadStream(file).pipe(res);
  });
  return new Promise((r) => server.listen(HTTP_PORT, () => r(server)));
}
const URL = `http://localhost:${HTTP_PORT}/`;
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run', '--no-default-browser-check', '--window-size=1366,900', '--force-device-scale-factor=1', '--user-data-dir=/tmp/cg-shot-profile', 'about:blank'], { stdio: 'ignore' });

async function target() {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(`http://localhost:${PORT}/json/new?${encodeURIComponent(URL)}`, { method:'PUT' }); if (r.ok) return r.json(); } catch {}
    await sleep(250);
  }
  throw new Error('no devtools');
}
function client(ws) {
  const s = new WebSocket(ws); let id = 0; const pend = new Map();
  s.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
  const ready = new Promise((r) => s.addEventListener('open', () => r()));
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); s.send(JSON.stringify({ id:i, method, params })); });
  return { ready, send, s };
}

let server;
try {
  server = await startServer();
  const t = await target();
  const c = client(t.webSocketDebuggerUrl);
  await c.ready;
  await c.send('Page.enable'); await c.send('Runtime.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width:1366, height:900, deviceScaleFactor:1, mobile:false });
  await sleep(3500);
  const shoot = async (name) => {
    const r = await c.send('Page.captureScreenshot', { format:'jpeg', quality:82 });
    writeFileSync(join(OUT, name), Buffer.from(r.result.data, 'base64'));
    console.log('shot', name);
  };
  await shoot('01-hero.jpg');
  // open the side drawer
  await c.send('Runtime.evaluate', { expression: `document.querySelector('.nav-burger')?.click()` });
  await sleep(900);
  await shoot('01b-drawer.jpg');
  await c.send('Runtime.evaluate', { expression: `document.querySelector('.nav-scrim')?.click()` });
  await sleep(600);
  for (const [anchor, file] of [['#about','02-about.jpg'],['#practices','03-practices.jpg'],['#events','04-events.jpg'],['#words','05-words.jpg'],['#podcast','06-podcast.jpg'],['#blog','07-blog.jpg'],['#contact','08-contact.jpg'],['#shop','09-shop.jpg']]) {
    await c.send('Runtime.evaluate', { expression: `document.querySelector('${anchor}')?.scrollIntoView({block:'start'})` });
    await sleep(1400);
    await shoot(file);
  }
  // open a blog article reader
  await c.send('Runtime.evaluate', { expression: `document.querySelector('#blog .article')?.click()` });
  await sleep(900);
  await shoot('07b-reader.jpg');
  c.s.close(); chrome.kill(); server?.close();
  console.log('done ->', OUT);
  process.exit(0);
} catch (e) { console.error('shot failed:', e.message); chrome.kill(); server?.close(); process.exit(1); }
