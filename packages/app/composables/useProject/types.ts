import type { application } from '@nwrx/nano-api'
import type { RouteRequestBody, RouteRequestQuery } from '@unserved/client'

export namespace UseProject {
  export interface UseOptions {
    workspace: string
    project: string
  }

  export interface UseSearchOptions {
    workspace: string
  }

  export type SearchOptions = RouteRequestQuery<typeof application, 'GET /api/workspaces/:workspace/projects'>
  export type FetchOptions = RouteRequestQuery<typeof application, 'GET /api/workspaces/:workspace/projects/:project'>
  export type CreateOptions = RouteRequestBody<typeof application, 'POST /api/workspaces/:workspace/projects'>
  export type UpdateOptions = RouteRequestBody<typeof application, 'PUT /api/workspaces/:workspace/projects/:project'>
}
