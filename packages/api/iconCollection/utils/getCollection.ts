/* eslint-disable sonarjs/no-nested-conditional */
import type { Loose } from '@unshared/types'
import type { IconCollection } from '../entities'
import type { ModuleIconCollection } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { assertUser } from '../../user/utils/assertUser'

export const GET_COLLECTION_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  name: assert.stringNotEmpty,
  withIcons: [[assert.undefined], [assert.boolean]],
  withIconsCount: [[assert.undefined], [assert.boolean]],
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDisabledBy: [[assert.undefined], [assert.boolean]],
})

export type GetCollectionOptions = Loose<ReturnType<typeof GET_COLLECTION_OPTIONS_SCHEMA>>

/**
 * Gets an icon collection by its name from the database.
 * Only superadmins can access collections.
 *
 * @param options The options for getting the collection.
 * @returns The icon collection entity.
 */
export async function getCollection(this: ModuleIconCollection, options: GetCollectionOptions): Promise<IconCollection> {
  const moduleUser = this.getModule(ModuleUser)
  const {
    name,
    user,
    withIcons = false,
    withIconsCount = false,
    withCreatedBy = false,
    withUpdatedBy = false,
    withDisabledBy = false,
  } = GET_COLLECTION_OPTIONS_SCHEMA(options)

  // --- Check if the user is a super administrator.
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_UNAUTHORIZED()

  // --- Get the collection from the database.
  const { IconCollection } = this.getRepositories()
  const collection = await IconCollection.findOne({
    where: { name },
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

  // --- Return the collection.
  if (!collection) throw this.errors.ICON_COLLECTION_NOT_FOUND(name)
  return collection
}
