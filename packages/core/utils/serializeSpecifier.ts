import type { SpecifierObject } from './parseSpecifier'

export function serializeSpecifier(specifier: SpecifierObject): string {
  const { registry, workspace, collection, name, tag } = specifier
  let result = ''
  if (registry !== 'default') result += `${registry}:`
  if (workspace !== 'default') result += `${workspace}/`
  if (collection !== 'default' || workspace !== 'default') result += `${collection}/`
  result += name
  if (tag !== 'latest') result += `@${tag}`
  return result
}
