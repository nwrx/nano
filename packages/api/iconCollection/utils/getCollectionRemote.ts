import type { Loose } from '@unshared/types'
import type { IconCollectionMetadata } from '../entities'
import type { ModuleIconCollection } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { assertUser } from '../../user/utils/assertUser'

export const GET_COLLECTION_REMOTE_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  name: assert.stringNotEmpty,
})

export type GetCollectionRemoteOptions = Loose<ReturnType<typeof GET_COLLECTION_REMOTE_OPTIONS_SCHEMA>>

/**
 * Gets an icon collection by its name from the remote Iconify API.
 * Only superadmins can access this function.
 *
 * @param options The options for getting the remote collection.
 * @returns The icon collection metadata from Iconify.
 */
export async function getCollectionRemote(
  this: ModuleIconCollection,
  options: GetCollectionRemoteOptions,
): Promise<IconCollectionMetadata> {
  const moduleUser = this.getModule(ModuleUser)
  const { name, user } = GET_COLLECTION_REMOTE_OPTIONS_SCHEMA(options)

  // --- Check if the user is a super administrator.
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_UNAUTHORIZED()

  // --- Fetch the collection metadata from the Iconify API.
  const url = new URL(`/collections?prefix=${name}`, this.iconIconifyUrl)
  const response = await fetch(url)
  if (!response.ok) throw this.errors.ICON_ICONIFY_FETCH_FAILED(response)

  // --- Parse the response and return the collection metadata.
  const data = await response.json() as Record<string, IconCollectionMetadata>
  const metadata = data[name]

  // --- Check if the collection was found.
  if (!metadata) throw this.errors.ICON_COLLECTION_NOT_FOUND(name)
  return metadata
}
