export function isInBangumiPage() {
  const url = window.location.pathname;
  return url.startsWith('/bangumi/play');
}
