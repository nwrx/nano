import type { application } from '@nwrx/nano-api'
import type { RouteRequestBody, RouteRequestQuery, RouteResponseData } from '@unserved/client'

export namespace UseRunner {
  export interface UseOptions {
    name: string
  }

  export type SearchOptions = RouteRequestQuery<typeof application, 'GET /api/runners'>
  export type FetchOptions = RouteRequestQuery<typeof application, 'GET /api/runners/:name'>
  export type RegisterOptions = RouteRequestBody<typeof application, 'POST /api/runners'>
  export type UpdateOptions = RouteRequestBody<typeof application, 'PUT /api/runners/:name'>
  export type RenameOptions = RouteRequestBody<typeof application, 'PUT /api/runners/:name/rename'>
}
