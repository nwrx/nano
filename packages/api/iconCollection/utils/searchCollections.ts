/* eslint-disable sonarjs/no-nested-conditional */
// Search icon collections based on a search term in the database
// Superadmin only

import type { Loose } from '@unshared/types'
import type { IconCollection } from '../entities'
import type { ModuleIconCollection } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ILike } from 'typeorm'
import { ModuleUser } from '../../user'
import { assertUser } from '../../user/utils/assertUser'

export const SEARCH_COLLECTIONS_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  search: [[assert.undefined], [assert.string]],
  limit: [[assert.undefined], [assert.numberInteger]],
  page: [[assert.undefined], [assert.numberInteger]],
  withIcons: [[assert.undefined], [assert.boolean]],
  withIconsCount: [[assert.undefined], [assert.boolean]],
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDisabledBy: [[assert.undefined], [assert.boolean]],
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
  const {
    search = '',
    user,
    page = 1,
    limit = 16,
    withIcons = false,
    withIconsCount = false,
    withCreatedBy = false,
    withUpdatedBy = false,
    withDisabledBy = false,
  } = SEARCH_COLLECTIONS_OPTIONS_SCHEMA(options)

  // --- Create the search operator.
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length > 2 ? ILike(`%${searchSafe}%`) : undefined

  // --- Check if the user is a super administrator.
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_UNAUTHORIZED()

  // --- Search for collections by name.
  const { IconCollection } = this.getRepositories()
  return IconCollection.find({
    where: [
      { name: searchOperator },
      { title: searchOperator },
    ],
    take: limit,
    skip: (page - 1) * limit,
    order: {
      status: 'ASC',
      name: 'ASC',
    },
    relations: {
      icons: withIcons || withIconsCount,
      createdBy: withCreatedBy,
      updatedBy: withUpdatedBy,
      disabledBy: withDisabledBy,
    },
    // @ts-expect-error: ignore
    select: {
      id: true,
      name: true,
      title: true,
      status: true,
      version: true,
      metadata: true,
      createdAt: withCreatedBy,
      createdBy: withCreatedBy,
      updatedAt: withUpdatedBy,
      updatedBy: withUpdatedBy,
      disabledAt: withDisabledBy,
      disabledBy: withDisabledBy,
      icons: withIcons ? true : (withIconsCount ? { id: true } : false),
    },
  })
}
