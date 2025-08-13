import type { application } from '@nwrx/nano-api'
import type { RouteRequestBody, RouteRequestQuery } from '@unserved/client'

export type IconFetchOptions = RouteRequestQuery<typeof application, 'GET /icons'>
export type IconCollectionFetchOptions = RouteRequestQuery<typeof application, 'GET /icons/collections/:name'>
export type IconCollectionDeleteOptions = RouteRequestBody<typeof application, 'DELETE /icons/collections/:name'>
export type IconCollectionSearchOptions = RouteRequestQuery<typeof application, 'GET /icons/collections'>
export type IconCollectionImportOptions = RouteRequestBody<typeof application, 'POST /icons/collections/:name'>
