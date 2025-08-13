import type { application } from '@nwrx/nano-api'
import type { RouteRequestBody, RouteRequestQuery } from '@unserved/client'

export namespace UseFlow {
  export interface UseOptions {
    workspace: string
    project: string
    name: string
  }

  export interface UseSearchOptions {
    workspace: string
    project: string
  }

  export type SearchOptions = RouteRequestQuery<typeof application, 'GET /workspaces/:workspace/projects/:project/flows'>
  export type FetchOptions = RouteRequestQuery<typeof application, 'GET /workspaces/:workspace/projects/:project/flows/:flow'>
  export type CreateOptions = RouteRequestBody<typeof application, 'POST /workspaces/:workspace/projects/:project/flows'>
  export type ImportOptions = FormData
}
