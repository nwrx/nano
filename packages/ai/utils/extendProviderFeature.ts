export function extendProviderFeature<T>(source?: T, extend?: T): T | undefined {
  if (!source && !extend) return undefined
  if (!source) return extend
  if (!extend) return source
  return { ...source, ...extend }
}
