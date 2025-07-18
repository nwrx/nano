import type { Loose } from '@unshared/types'
import type { ModuleIcon } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ILike, In, IsNull } from 'typeorm'

/** Options schema for the `searchIcons` function. */
export const SEARCH_ICON_OPTIONS_SCHEMA = createParser({
  search: [[assert.undefined], [assert.string]],
  page: [[assert.undefined], [assert.numberInteger]],
  limit: [[assert.undefined], [assert.numberInteger]],
})

/** Options for the `searchIcons` function. */
export type SearchIconOptions = Loose<ReturnType<typeof SEARCH_ICON_OPTIONS_SCHEMA>>

/**
 * Will search for icons based on the provided options.
 *
 * @param options The options to search for icons.
 * @returns A promise that resolves to an array of icons.
 */
export async function searchIcons(this: ModuleIcon, options: SearchIconOptions) {
  const { Icon } = this.getRepositories()
  const { search, page = 1, limit = 10 } = options

  // --- Search for the icons using the Iconify API.
  return await Icon.find({
    where: {
      name: search ? ILike(`%${search}%`) : undefined,
      collection: {
        deletedAt: IsNull(),
        status: In(['Installed', 'Outdated']),
      },
    },
    order: { name: 'ASC' },
    take: limit,
    skip: (page - 1) * limit,
  })
}
