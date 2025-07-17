import { glob } from '@unshared/fs/glob'
import { writeFile } from 'node:fs/promises'
import { readFile } from 'node:fs/promises'

/** The absolute path to the `pages` directory. */
const PAGES_DIR = new URL('../pages', import.meta.url).pathname
const SAFELIST_PATH = new URL('../theme/iconSafelists.json', import.meta.url).pathname

/** Regular expression to match the `definePageMeta` metadata in a Vue component. */
const DEFINE_META_EXP = /definePageMeta\s*\(\s*({(?:[^{}]|{[^{}]*})*})\s*\)/

/** Regular expression to extract the `icon` property from the `definePageMeta` metadata. */
const ICON_PROPERTY_EXP = /icon\s*:\s*["']([^"']+)["']/

/**
 * Iterate over all of the `*.vue` components in the `pages` directory, extract
 * the `definePageMeta` metadata from each component, and take the `icon` property
 * to create a safelist of icons.
 */
export async function createIconSafelist() {

  // --- Iterate over all Vue components in the pages directory and
  // --- extract the `icon` property from the `definePageMeta` metadata.
  const safelist = new Set<string>()
  const pages = glob('**/*.vue', { cwd: PAGES_DIR, onlyFiles: true })
  for await (const path of pages) {
    const content = await readFile(path, 'utf8')
    const defineMeta = DEFINE_META_EXP.exec(content)
    if (!defineMeta) continue
    const iconProperty = ICON_PROPERTY_EXP.exec(defineMeta[0])
    if (!iconProperty) continue
    const icon = iconProperty[1]
    if (!icon) continue
    safelist.add(icon)
  }

  // --- Write the safelist to a JSON file.
  const safelistArray = [...safelist].toSorted((a, b) => a.localeCompare(b))
  const safelistContent = JSON.stringify(safelistArray, undefined, 2)
  await writeFile(SAFELIST_PATH, safelistContent, 'utf8')
}

await createIconSafelist()
