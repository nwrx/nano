import type { application } from '@nwrx/nano-api'
import type { RouteRequestBody, RouteRequestQuery } from '@unserved/client'

export type McpPoolsFetchOptions = RouteRequestQuery<typeof application, 'GET /api/workspaces/:workspace/pools'>

export type McpPoolFetchOptions = RouteRequestQuery<typeof application, 'GET /api/workspaces/:workspace/pools/:pool'>
export type McpPoolUpdateOptions = RouteRequestBody<typeof application, 'PUT /api/workspaces/:workspace/pools/:pool'>

export type McpServerFetchOptions = RouteRequestQuery<typeof application, 'GET /api/workspaces/:workspace/pools/:pool/servers/:server'>
export type McpServerUpdateOptions = RouteRequestBody<typeof application, 'PUT /api/workspaces/:workspace/pools/:pool/servers/:server'>
export type McpServerUpdateSpecOptions = RouteRequestBody<typeof application, 'PUT /api/workspaces/:workspace/pools/:pool/servers/:server/spec'>
export type McpServerCreateArgumentOptions = RouteRequestBody<typeof application, 'POST /api/workspaces/:workspace/pools/:pool/servers/:server/arguments'>
export type McpServerUpdateArgumentOptions = RouteRequestBody<typeof application, 'PUT /api/workspaces/:workspace/pools/:pool/servers/:server/arguments/:position'>
export type McpServerFetchToolsOptions = RouteRequestQuery<typeof application, 'GET /api/workspaces/:workspace/pools/:pool/servers/:server/tools'>

export type McpServerVariablesFetchOptions = RouteRequestQuery<typeof application, 'GET /api/workspaces/:workspace/pools/:pool/servers/:server/variables'>
export type McpServerVariableCreateOptions = RouteRequestBody<typeof application, 'POST /api/workspaces/:workspace/pools/:pool/servers/:server/variables'>
export type McpServerVariableUpdateOptions = RouteRequestBody<typeof application, 'PUT /api/workspaces/:workspace/pools/:pool/servers/:server/variables/:name'>
