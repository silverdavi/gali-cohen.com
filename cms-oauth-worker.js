/**
 * Minimal GitHub OAuth helper for Decap CMS, for Cloudflare Workers.
 *
 * Why this exists: GitHub Pages is static and can't keep the GitHub client
 * secret or do the token exchange. This worker does only that, nothing else.
 *
 * Deploy: see CMS-SETUP.md. Set two secrets on the worker:
 *   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 *
 * Routes:
 *   /auth      -> redirects to GitHub's authorize screen
 *   /callback  -> exchanges the code for a token and hands it back to Decap
 */

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN = 'https://github.com/login/oauth/access_token';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth') {
      const redirectUri = `${url.origin}/callback`;
      const authUrl = new URL(GITHUB_AUTHORIZE);
      authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('scope', 'repo');
      authUrl.searchParams.set('state', crypto.randomUUID());
      return Response.redirect(authUrl.toString(), 302);
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('Missing code', { status: 400 });

      const tokenRes = await fetch(GITHUB_TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const data = await tokenRes.json();
      const token = data.access_token;
      const status = token ? 'success' : 'error';
      const result = token
        ? { token, provider: 'github' }
        : { error: data.error || 'no_token' };

      // Canonical Decap popup handshake: announce, then post the token back to
      // the opener window when it acknowledges.
      const message = `authorization:github:${status}:${JSON.stringify(result)}`;
      const html = `<!doctype html>
<html><body>
<script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(${JSON.stringify(message)}, e.origin);
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
</body></html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response('Decap OAuth helper. Use /auth.', { status: 200 });
  },
};
