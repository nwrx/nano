/**
 * Join an URL with a path and another path without overriding the base path
 * and omitting double slashes. Since the native `URL` actually overrides the
 * base path, this function is necessary to avoid this behavior.
 *
 * @param baseUrl the base URL
 * @param path the path to join
 * @returns the joined URL
 */
export function joinUrl(baseUrl: string, path: string): URL {
  const url = [baseUrl.replace(/\/$/, ''), path.replace(/^\//, '')].join('/')
  return new URL(url)
}
