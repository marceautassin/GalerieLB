/**
 * Construit une URL interne : préfixe la base du site et force le `/` final sur les pages,
 * comme la canonique et le sitemap. Laisse intacts les fichiers (dernier segment avec une
 * extension : `/llms.txt`, `/logo.svg`), la requête (`?a=b`) et l'ancre (`#x`).
 */
export function withBase(base: string, path: string): string {
  const prefix = base.replace(/\/$/, '');
  const match = /^([^?#]*)(.*)$/.exec(path);
  const pathname = match?.[1] ?? '';
  const suffix = match?.[2] ?? '';
  const isFile = /\.[^/]+$/.test(pathname);
  const withSlash = isFile || pathname.endsWith('/') ? pathname : `${pathname}/`;
  return `${prefix}${withSlash}${suffix}`;
}

const base = import.meta.env?.BASE_URL ?? '/';
export const url = (path: string) => withBase(base, path);
