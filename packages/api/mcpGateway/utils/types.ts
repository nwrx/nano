import type { OpenAPIResolved, OperationById, OperationOptions, OperationResult } from '@unshared/client/openapi'
import type { MCP_GATEWAY_SCHEMA } from './schemaGateway'

/** The OpenAPI schema for the MCP gateway server. */
export namespace NmcpGateway {
  export type Schema = OpenAPIResolved<typeof MCP_GATEWAY_SCHEMA>

  /** A message that can be sent to an MCP server via the SSE endpoint of a gateway. */
  export type Message = OperationOptions<Schema, OperationById<Schema, 'postServerSseMessage'>>

  /** The result of the getGatewayHealthStatus operation. */
  export type Status = OperationResult<Schema, OperationById<Schema, 'getGatewayHealthStatus'>>
}
