import type { IconCollectionEvents } from './utils'
import { createEventBus, ModuleBase } from '@unserved/server'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import { ERRORS } from './utils'

export * from './entities'

export interface ModuleIconCollectionOptions {

  /**
   * The URL to an NPM CDN that hosts the `@iconify/json` package. This package
   * is used to import the icon collections from the Iconify API.
   *
   * @default 'https://esm.sh/'
   */
  iconCdnUrl: string

  /**
   * The URL of the Iconify API used to gather information about the icons and
   * their collections. It is used to fetch the icons from the remote source.
   *
   * @default 'https://api.iconify.design/'
   */
  iconifyUrl: string
}

/**
 * The "Icon" module provides a way to manage icons for the website content
 * using the Iconify CDN. The icons are stored as assets in the asset module.
 */
export class ModuleIconCollection extends ModuleBase implements ModuleIconCollectionOptions {
  errors = ERRORS
  routes = ROUTES
  entities = ENTITIES

  iconCdnUrl: string
  iconifyUrl: string
  iconEventBus = createEventBus<IconCollectionEvents>()
  iconInstallLock = new Map<string, Promise<void>>()

  constructor(options: ModuleIconCollectionOptions) {
    super()
    this.iconCdnUrl = options.iconCdnUrl
    this.iconifyUrl = options.iconifyUrl
  }
}
