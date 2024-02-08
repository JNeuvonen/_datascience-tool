export function removeQueryParam(paramKey: string) {
  const url = new URL(window.location.href);
  url.searchParams.delete(paramKey);
  window.history.pushState({}, "", url);
}
