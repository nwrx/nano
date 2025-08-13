import type { ModuleThread, ThreadObject } from '@nwrx/nano-api'
import type { RouteRequestBody, RouteRequestParameters, RouteRequestQuery } from '@unserved/client'

export namespace UseThread {
  export type UseOptions = RouteRequestParameters<ModuleThread, 'GET /workspaces/:workspace/projects/:project/flows/:flow/threads/:thread'>
  export type UseSearchOptions = RouteRequestParameters<ModuleThread, 'GET /workspaces/:workspace/projects/:project/flows/:flow/threads'>
  export type SearchOptions = RouteRequestQuery<ModuleThread, 'GET /workspaces/:workspace/projects/:project/flows/:flow/threads'>
  export type FetchOptions = RouteRequestQuery<ModuleThread, 'GET /workspaces/:workspace/projects/:project/flows/:flow/threads/:thread'>
  export type CreateOptions = RouteRequestBody<ModuleThread, 'POST /workspaces/:workspace/projects/:project/flows/:flow/threads'>

  export type GroupType =
    | 'lastHour'
    | 'older'
    | 'thisWeek'
    | 'today'

  export interface Group {
    icon: string
    type: GroupType
    threads: ThreadObject[]
  }
}
