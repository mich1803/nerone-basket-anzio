const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function assetPath(path: string) {
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}

export const sitePath = assetPath;

export function instagramUrl(value: string) {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(?:www\.)?instagram\.com\//i.test(trimmed)) return `https://${trimmed}`;

  const username = trimmed.replace(/^@/, '').replace(/^\/+|\/+$/g, '');
  return `https://www.instagram.com/${username}/`;
}
