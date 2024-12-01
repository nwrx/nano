import type { CSSProperties } from 'vue'
import { toKebabCase } from '@unshared/string/toKebabCase'

/**
 * Convert an object that may have camelCase keys to an object with kebab-case keys.
 *
 * @param object The object to convert.
 * @returns The object with kebab-case keys.
 */
export function toCSSObject(object: CSSProperties) {
  const result: Record<string, string> = {}
  for (const key in object) result[toKebabCase(key)] = object[key as keyof CSSProperties] as string
  return result
}
