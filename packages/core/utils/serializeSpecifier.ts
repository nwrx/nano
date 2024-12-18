import type { SpecifierObject } from './parseSpecifier'

export function serializeSpecifier(specifier: SpecifierObject): string {
  const { name, tag, registry, collection } = specifier

  // 'latest' tag is implicit.
  if (tag === 'latest') {
    return registry === 'default'
      ? `${collection}/${name}`
      : `${registry}:${collection}/${name}`
  }

  // 'default' tag is implicit.
  return registry === 'default'
    ? `${collection}/${name}@${tag}`
    : `${registry}:${collection}/${name}@${tag}`
}
