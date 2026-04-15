export const MAX_URLS_PER_SITEMAP = 50000;

export function getSiteUrl() {
  return process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.mmsweden.se';
}

export function getApiUrl() {
  return (
    process.env.API_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
    'https://mmsweden-server.onrender.com'
  );
}
