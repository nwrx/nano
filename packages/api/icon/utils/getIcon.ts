import type { Loose } from '@unshared/types'
import type { Icon } from '../entities'
import type { ModuleIcon } from '../index'
import { assert, createParser } from '@unshared/validation'

export const GET_ICON_OPTIONS_SCHEMA = createParser({
  name: [assert.stringNotEmpty],
  withFile: [[assert.undefined], [assert.boolean]],
  withCollection: [[assert.undefined], [assert.boolean]],
})

export type GetIconOptions = Loose<ReturnType<typeof GET_ICON_OPTIONS_SCHEMA>>

/**
 * Given an icon name, download the icon from the configured CDN and
 * store it using the `Asset` module. The icon is then returned as an
 * `Asset` entity. If the icon is already stored, it is returned directly.
 *
 * @param options The options for getting the icon.
 * @returns The `Asset` entity of the icon.
 */
export async function getIcon(this: ModuleIcon, options: GetIconOptions): Promise<Icon> {
  const {
    name,
    withFile = false,
    withCollection = false,
  } = GET_ICON_OPTIONS_SCHEMA(options)

  // --- Find the icon in the database.
  const { Icon } = this.getRepositories()
  const icon = await Icon.findOne({
    where: { name },
    relations: {
      file: withFile,
      collection: withCollection,
    },
  })

  // --- If the icon is not found, throw an error.
  if (!icon) throw this.errors.ICON_NOT_FOUND(name)
  return icon
}
