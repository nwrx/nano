// Search icon collections based on a search term in iconify API
// Superadmin only

import type { Loose } from '@unshared/types'
import type { IconCollectionMetadata } from '../entities'
import type { ModuleIconCollection } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { assertUser } from '../../user/utils/assertUser'

export const SEARCH_COLLECTIONS_REMOTE_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  search: [[assert.undefined], [assert.string]],
})

export type SearchCollectionsRemoteOptions = Loose<ReturnType<typeof SEARCH_COLLECTIONS_REMOTE_OPTIONS_SCHEMA>>

/**
 * Searches for icon collections in the remote Iconify API based on a search term.
 * Only superadmins can search remote collections.
 *
 * @param options The search options.
 * @returns An array of matching icon collection metadata objects.
 */
export async function searchCollectionsRemote(
  this: ModuleIconCollection,
  options: SearchCollectionsRemoteOptions,
): Promise<IconCollectionMetadata[]> {
  const moduleUser = this.getModule(ModuleUser)
  const { search, user } = SEARCH_COLLECTIONS_REMOTE_OPTIONS_SCHEMA(options)

  // --- Check if the user is a super administrator.
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_UNAUTHORIZED()

  // --- Build the URL for searching collections.
  const url = new URL('/collections', this.iconIconifyUrl)
  if (search) url.searchParams.append('prefix', search)

  // --- Fetch collections from the Iconify API.
  const response = await fetch(url)
  if (!response.ok) throw this.errors.ICON_ICONIFY_FETCH_FAILED(response)

  // --- Parse the response and return the collections.
  const data = await response.json() as Record<string, IconCollectionMetadata>
  return Object.values(data).sort((a, b) => a.name.localeCompare(b.name))
}
