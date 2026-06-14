// Headless-Chrome smoke test for the cinemagraphs.
// Serves ./dist with a tiny built-in static server, then scrolls every <video>
// into view and confirms it is actually playing (not paused + currentTime
// advancing) with a decoded frame. Fully self-contained (no vite/npx).
import { spawn } from 'node:child_process';
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9222;
const HTTP_PORT = 4322;
const DIST = join(process.cwd(), 'dist');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.webm': 'video/webm', '.mp4': 'video/mp4', '.jpg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml',
  '.txt': 'text/plain',
};

function startServer() {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/') p = '/index.html';
    let file = join(DIST, p);
    if (!existsSync(file) || statSync(file).isDirectory()) file = join(DIST, 'index.html');
    res.setHeader('Content-Type', MIME[extname(file)] || 'application/octet-stream');
    res.setHeader('Accept-Ranges', 'bytes');
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(HTTP_PORT, () => resolve(server)));
}

const URL = `http://localhost:${HTTP_PORT}/`;

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`,
  '--no-first-run', '--no-default-browser-check',
  '--window-size=1280,900', '--disable-gpu',
  '--user-data-dir=/tmp/cg-smoke-profile',
  'about:blank',
], { stdio: 'ignore' });

async function cdpTarget() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://localhost:${PORT}/json/new?${encodeURIComponent(URL)}`, { method: 'PUT' });
      if (r.ok) return await r.json();
    } catch {}
    try {
      const r = await fetch(`http://localhost:${PORT}/json/new?${encodeURIComponent(URL)}`);
      if (r.ok) return await r.json();
    } catch {}
    await sleep(250);
  }
  throw new Error('chrome devtools not reachable');
}

function client(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  });
  const ready = new Promise((res) => ws.addEventListener('open', () => res()));
  const send = (method, params = {}) => new Promise((res) => {
    const myId = ++id;
    pending.set(myId, res);
    ws.send(JSON.stringify({ id: myId, method, params }));
  });
  return { ready, send, ws };
}

const EXPR = `(async () => {
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  await wait(900);
  const canHover = matchMedia('(hover: hover)').matches;
  const vids = [...document.querySelectorAll('video')];
  const out = [];
  for (const v of vids) {
    v.scrollIntoView({ block: 'center' });
    await wait(700);
    const rec = {
      src: (v.currentSrc || '').split('/').pop(),
      restPaused: v.paused,         // should be TRUE at rest in hover mode
    };
    if (canHover) {
      const target = v.parentElement || v;
      target.dispatchEvent(new PointerEvent('pointerenter'));
      await wait(700);
      const t0 = v.currentTime;
      await wait(500);
      rec.hoverPlaying = !v.paused && v.currentTime > t0;
      rec.decoded = v.videoWidth + 'x' + v.videoHeight; // now that it has loaded
      target.dispatchEvent(new PointerEvent('pointerleave'));
      await wait(300);
      rec.leftPaused = v.paused;
    } else {
      const t0 = v.currentTime;
      await wait(600);
      rec.inViewPlaying = !v.paused && v.currentTime > t0;
      rec.decoded = v.videoWidth + 'x' + v.videoHeight;
    }
    out.push(rec);
  }
  return JSON.stringify({ count: vids.length, canHover, videos: out });
})()`;

let server;
try {
  server = await startServer();
  const t = await cdpTarget();
  const c = client(t.webSocketDebuggerUrl);
  await c.ready;
  await c.send('Page.enable');
  await c.send('Runtime.enable');
  await sleep(2500); // let React mount + assets warm
  const res = await c.send('Runtime.evaluate', { expression: EXPR, awaitPromise: true, returnByValue: true });
  if (res.result?.exceptionDetails) throw new Error(JSON.stringify(res.result.exceptionDetails));
  const data = JSON.parse(res.result.result.value);
  console.log(`videos found: ${data.count}   mode: ${data.canHover ? 'hover-to-play' : 'in-view (touch fallback)'}`);
  let ok = 0;
  for (const v of data.videos) {
    let pass, detail;
    if (data.canHover) {
      pass = v.restPaused && v.hoverPlaying && v.leftPaused && v.decoded !== '0x0';
      detail = `rest=${v.restPaused ? 'still' : 'PLAYING!'} hover=${v.hoverPlaying ? 'plays' : 'dead'} leave=${v.leftPaused ? 'stops' : 'STUCK!'} decoded=${v.decoded}`;
    } else {
      pass = v.inViewPlaying && v.decoded !== '0x0';
      detail = `inView=${v.inViewPlaying ? 'plays' : 'dead'} decoded=${v.decoded}`;
    }
    if (pass) ok++;
    console.log(`  ${pass ? 'OK  ' : 'FAIL'}  ${v.src.padEnd(20)} ${detail}`);
  }
  console.log(`\nresult: ${ok}/${data.count} cinemagraphs behave correctly`);
  c.ws.close();
  chrome.kill();
  server?.close();
  process.exit(ok > 0 && ok === data.count ? 0 : 2);
} catch (err) {
  console.error('smoke failed:', err.message);
  chrome.kill();
  server?.close();
  process.exit(1);
}
