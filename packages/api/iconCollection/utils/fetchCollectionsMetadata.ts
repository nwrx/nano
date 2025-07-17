import type { IconifyInfo } from '@iconify/types'
import type { ModuleIconCollection } from '../index'

/**
 * Gets all icon collections from the remote Iconify API.
 *
 * @returns An array of matching icon collection metadata objects.
 */
export async function fetchCollectionsMetadata(this: ModuleIconCollection): Promise<Record<string, IconifyInfo>> {
  const url = new URL('/collections', this.iconIconifyUrl)
  const response = await fetch(url)
  if (!response.ok) throw this.errors.ICON_COLLECTION_DOWNLOAD_METADATA_FAILED(response)
  return await response.json() as Record<string, IconifyInfo>
}
