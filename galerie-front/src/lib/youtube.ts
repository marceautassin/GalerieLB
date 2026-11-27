const ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const SHORT_HOSTS = new Set(['youtu.be']);
const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com']);
const NOCOOKIE_HOSTS = new Set(['youtube-nocookie.com', 'www.youtube-nocookie.com']);
const PATH_PREFIXES = new Set(['shorts', 'embed', 'live']);

function validId(candidate: string | null | undefined): string | null {
  return candidate && ID_PATTERN.test(candidate) ? candidate : null;
}

/** Extrait l'identifiant d'une URL YouTube, ou `null` si l'URL n'est pas reconnue. Ne lève jamais. */
export function parseYoutubeId(url: string | null | undefined): string | null {
  if (typeof url !== 'string') return null;

  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;

  const host = parsed.hostname.toLowerCase();
  const segments = parsed.pathname.split('/').filter(Boolean);

  if (SHORT_HOSTS.has(host)) {
    return validId(segments[0]);
  }
  if (YOUTUBE_HOSTS.has(host)) {
    if (segments[0] === 'watch') return validId(parsed.searchParams.get('v'));
    if (PATH_PREFIXES.has(segments[0])) return validId(segments[1]);
    return null;
  }
  if (NOCOOKIE_HOSTS.has(host)) {
    return segments[0] === 'embed' ? validId(segments[1]) : null;
  }
  return null;
}

export const youtubeThumbnail = (id: string): string => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const youtubeEmbedUrl = (id: string): string => `https://www.youtube-nocookie.com/embed/${id}`;

export const youtubeWatchUrl = (id: string): string => `https://www.youtube.com/watch?v=${id}`;
