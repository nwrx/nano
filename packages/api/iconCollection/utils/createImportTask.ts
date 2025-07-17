import type { H3Event } from 'h3'
import type { Icon } from '../../icon'
import type { StorageFile } from '../../storage'
import type { IconCollection, IconCollectionMetadata } from '../entities'
import type { ModuleIconCollection } from '../index'
import type { IconCollectionDownload, ImportTaskEvent } from './types'
import { createEventStream, type EventStream } from '@unserved/server'
import { ModuleIcon } from '../../icon'
import { ModuleStorage } from '../../storage'

export class ImportTask {
  constructor(
    private name: string,
    private moduleIconCollection: ModuleIconCollection,
  ) {}

  /***************************************************************************/
  /* Subscriptions                                                           */
  /***************************************************************************/

  peers = new Set<EventStream<ImportTaskEvent>>()

  subscribe(event: H3Event): EventStream<ImportTaskEvent> {
    const eventStream = createEventStream<ImportTaskEvent>(event)
    this.peers.add(eventStream)
    eventStream.h3EventStream.onClosed(() => this.peers.delete(eventStream))
    return eventStream
  }

  async broadcast(event: ImportTaskEvent): Promise<void> {
    for (const peer of this.peers) await peer.sendMessage(event)
  }

  /***************************************************************************/
  /* Steps                                                                   */
  /***************************************************************************/

  files: StorageFile[] = []
  metadata: IconCollectionMetadata | undefined
  download: IconCollectionDownload | undefined

  private async fetchCollectionMetadata() {
    if (this.metadata) return this.metadata
    await this.broadcast({ event: 'fetchMetadataStart' })
    const url = new URL(`/collections?prefix=${this.name}`, this.moduleIconCollection.iconIconifyUrl)
    const response = await fetch(url)
    if (!response.ok) throw this.moduleIconCollection.errors.ICON_ICONIFY_FETCH_FAILED(response)
    const data = await response.json() as Record<string, IconCollectionMetadata>
    await this.broadcast({ event: 'fetchMetadataEnd' })
    this.metadata = data[this.name]
    return this.metadata
  }

  private async fetchCollectionDownload() {
    if (this.download) return this.download
    await this.broadcast({ event: 'fetchDownloadStart' })
    const collectionUrl = new URL(`@iconify-json/${this.name}/icons.json`, this.moduleIconCollection.iconCdn)
    const collectionResponse = await fetch(collectionUrl)
    if (!collectionResponse.ok) throw this.moduleIconCollection.errors.ICON_ICONIFY_IMPORT_FAILED(collectionResponse)
    const collectionData = await collectionResponse.json() as IconCollectionDownload
    await this.broadcast({ event: 'fetchDownloadEnd' })
    this.download = collectionData
    return this.download
  }

  private async createIconEntity(
    name: string,
    metadata: IconCollectionMetadata,
    download: IconCollectionDownload,
    collection: IconCollection,
  ): Promise<Icon> {
    const moduleIcon = this.moduleIconCollection.getModule(ModuleIcon)
    const moduleStorage = this.moduleIconCollection.getModule(ModuleStorage)
    const { Icon } = moduleIcon.getRepositories()

    // --- Dispatch the upload event.
    await this.broadcast({ event: 'uploadIcon', name })

    // --- Prepare the icon data and upload it.
    const iconName = `${this.name}:${name}`
    const isSample = metadata.samples.includes(name)
    const iconBody = download.icons[name].body
    const iconData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${download.width} ${download.height}">${iconBody}</svg>`
    const iconFile = await moduleStorage.upload({
      data: iconData,
      name: `${iconName}.svg`,
      type: 'image/svg+xml',
      pool: 'Default',
      size: iconData.length,
    })

    // --- Create the icon entity.
    return Icon.create({
      name: iconName,
      file: iconFile,
      isSample,
      collection,
    })
  }

  /***************************************************************************/
  /* Import Icon Collection                                                  */
  /***************************************************************************/

  async import(): Promise<void> {
    await this.broadcast({ event: 'start' })
    const metadata = await this.fetchCollectionMetadata()
    const download = await this.fetchCollectionDownload()

    // --- Save the collection to the database.
    const { IconCollection } = this.moduleIconCollection.getRepositories()
    const collection = IconCollection.create({ name: this.name, metadata })
    await IconCollection.save(collection)

    // --- For each icon, create and save it in the database.
    for (const iconName in download.icons) {
      const icon = await this.createIconEntity(iconName, metadata, download, collection)
      await IconCollection.save(icon)
    }

    // --- Broadcast the completion event.
    await this.broadcast({ event: 'done' })
  }
}

export function createImportTask(this: ModuleIconCollection, name: string): ImportTask {
  return new ImportTask(name, this)
}
