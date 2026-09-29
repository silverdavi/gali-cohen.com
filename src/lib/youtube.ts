// Turns a youtube.com/playlist, /watch or a youtu.be link into a
// youtube-nocookie.com embed URL. Returns null for anything else (a show
// whose link isn't YouTube just keeps behaving like a plain external link).
export function toEmbedUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!/(^|\.)youtube\.com$/.test(parsed.hostname) && parsed.hostname !== 'youtu.be') return null;

  const list = parsed.searchParams.get('list');
  if (list) return `https://www.youtube-nocookie.com/embed/videoseries?list=${list}`;

  const v = parsed.searchParams.get('v');
  if (v) return `https://www.youtube-nocookie.com/embed/${v}`;

  if (parsed.hostname === 'youtu.be') {
    const id = parsed.pathname.slice(1);
    if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
  }
  return null;
}

/** A single known video ID -> embed URL (episodes store just the ID, not a full link). */
export const videoIdToEmbedUrl = (videoId: string): string => `https://www.youtube-nocookie.com/embed/${videoId}`;
