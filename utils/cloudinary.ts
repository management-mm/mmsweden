export function optimizeCloudinaryImage(url: string, width = 800) {
  if (!url.includes('/upload/')) return url;

  return url.replace(
    '/upload/',
    `/upload/f_auto,q_auto,c_limit,w_${width},dpr_auto/`
  );
}
