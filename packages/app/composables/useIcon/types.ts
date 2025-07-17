import type { application } from '@nwrx/nano-api'
import type { RouteRequestBody, RouteRequestQuery } from '@unserved/client'

export type IconCollectionFetchOptions = RouteRequestQuery<typeof application, 'GET /api/icons/collections/:name'>
export type IconCollectionDeleteOptions = RouteRequestBody<typeof application, 'DELETE /api/icons/collections/:name'>
export type IconCollectionSearchOptions = RouteRequestQuery<typeof application, 'GET /api/icons/collections'>
export type IconCollectionImportOptions = RouteRequestBody<typeof application, 'POST /api/icons/collections/:name'>

export interface ImportTaskObject {
  id: string
  name: string
  status: 'completed' | 'failed' | 'pending' | 'running'
  progress: number
  createdAt: string
  updatedAt: string
  error?: string
}
