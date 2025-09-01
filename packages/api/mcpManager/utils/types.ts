import type { ServerErrorName } from '@unserved/server'
import type { OpenAPIResolved, OpenAPIV3, OperationById, OperationOptions, OperationResult } from '@unshared/client/openapi'
import type { MCP_MANAGER_SCHEMA } from './schemaManager'

/** The OpenAPI schema for the MCP manager server. */
export namespace NmcpManager {
  export type Schema = OpenAPIResolved<typeof MCP_MANAGER_SCHEMA>

  /** A message that can be sent to an MCP manager via the SSE endpoint. */
  export type Status = OperationResult<Schema, OperationById<Schema, 'getHealthStatus'>>

  /** The result of the `getPoolByName` operation. */
  export type Pool = OperationResult<Schema, OperationById<Schema, 'getPoolByName'>>
  export type CreatePoolOptions = OperationOptions<Schema, OperationById<Schema, 'createPool'>>['body']
  export type PatchPoolOptions = OperationOptions<Schema, OperationById<Schema, 'updatePoolByName'>>['body']
  export type PatchPoolResult = OperationResult<Schema, OperationById<Schema, 'updatePoolByName'>>

  /** The result of the `getServerByName` operation. */
  export type Server = OperationResult<Schema, OperationById<Schema, 'getServerByName'>>
  export type CreateServerOptions = OpenAPIV3.RequestBody<OperationById<Schema, 'createServer'>>
  export type UpdateServerOptions = OpenAPIV3.RequestBody<OperationById<Schema, 'updateServerByName'>>

  /** The status of a server. */
  export type ServerStatus = Server['status']

  /** The body of an error response from the MCP manager. */
  export interface Error {
    name: ServerErrorName
    message: string
    statusCode: number
    statusMessage: string
  }
}
