// Search icon collections based on a search term in the database
// Superadmin only

import type { Loose } from '@unshared/types'
import type { IconCollection } from '../entities'
import type { ModuleIconCollection } from '../index'
import { assert, createParser } from '@unshared/validation'
import { Like } from 'typeorm'
import { ModuleUser } from '../../user'
import { assertUser } from '../../user/utils/assertUser'

export const SEARCH_COLLECTIONS_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  search: [[assert.undefined], [assert.string]],
  limit: [[assert.undefined], [assert.numberInteger]],
  page: [[assert.undefined], [assert.numberInteger]],
  withIcons: [[assert.undefined], [assert.boolean]],
})

export type SearchCollectionsOptions = Loose<ReturnType<typeof SEARCH_COLLECTIONS_OPTIONS_SCHEMA>>

/**
 * Searches for icon collections in the database based on a search term.
 * Only superadmins can search collections.
 *
 * @param options The search options.
 * @returns An array of matching icon collections.
 */
export async function searchCollections(this: ModuleIconCollection, options: SearchCollectionsOptions): Promise<IconCollection[]> {
  const moduleUser = this.getModule(ModuleUser)
  const { search, user, limit = 10, page = 1, withIcons } = SEARCH_COLLECTIONS_OPTIONS_SCHEMA(options)

  // --- Check if the user is a super administrator.
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_UNAUTHORIZED()

  // --- Search for collections by name.
  const { IconCollection } = this.getRepositories()
  return IconCollection.find({
    where: { name: Like(`%${search}%`) },
    take: limit,
    skip: (page - 1) * limit,
    relations: { icons: withIcons },
    order: { name: 'ASC' },
  })
}
