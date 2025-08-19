import type { application } from '@nwrx/nano-api'
import type { RouteRequestBody, RouteRequestQuery } from '@unserved/client'

export namespace UseRunner {
  export interface UseOptions {
    name: string
  }

  export type SearchOptions = RouteRequestQuery<typeof application, 'GET /runners'>
  export type FetchOptions = RouteRequestQuery<typeof application, 'GET /runners/:name'>
  export type RegisterOptions = RouteRequestBody<typeof application, 'POST /runners'>
  export type UpdateOptions = RouteRequestBody<typeof application, 'PUT /runners/:name'>
  export type RenameOptions = RouteRequestBody<typeof application, 'PUT /runners/:name/rename'>
}
