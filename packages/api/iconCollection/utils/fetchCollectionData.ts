import type { IconifyJSONIconsData } from '@iconify/types'
import type { ModuleIconCollection } from '../index'

/**
 * Get the data for the icon collection by downloading the `icons.json` file from the CDN.
 *
 * @param name The name of the icon collection.
 * @returns The icon collection download data.
 */
export async function fetchCollectionData(this: ModuleIconCollection, name: string): Promise<IconifyJSONIconsData> {
  const url = new URL(`@iconify-json/${name}/icons.json`, this.iconCdn)
  const response = await fetch(url)
  if (!response.ok) throw this.errors.ICON_COLLECTION_DOWNLOAD_DATA_FAILED(response)
  const data = await response.json() as IconifyJSONIconsData
  return data
}
