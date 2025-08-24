import type { HttpMethod } from '../../Type';

export const covertToKyMethod = (method: Request['method']) => {
  return method.toLowerCase() as HttpMethod;
};

export function removePrefixUrl(url: string) {
  try {
    if (url.startsWith('/')) {
      return url.slice(1);
    }
    const newURL = new URL(url);
    return `${newURL.pathname.slice(1)}${newURL.search}`;
  } catch {
    return url;
  }
}
