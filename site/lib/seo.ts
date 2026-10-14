export const SITE_URL = 'https://mich1803.github.io/nerone-basket-anzio';

export function absoluteSiteUrl(path = '/') {
  if (path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
