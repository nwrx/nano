import type { OpenAPIResolved, OperationById, OperationResult } from '@unshared/client/openapi'
import type { MCP_MANAGER_SCHEMA } from '../../mcpManager/utils/schemaManager'
import type { McpServerSpec } from './assertMcpServerSpec'

export type McpManagerSchema = OpenAPIResolved<typeof MCP_MANAGER_SCHEMA>
export type McpManagerServerBody = OperationResult<McpManagerSchema, OperationById<McpManagerSchema, 'getServerByName'>>
export type McpManagerServerPhase = McpManagerServerBody['status']['phase']

export interface McpServerStatus {
  isSynchronized: boolean
  startedAt: null | string
  stoppedAt: null | string
  lastRequestAt: null | string
  phase: McpManagerServerPhase
  // conditions: []
  totalRequests: 0
  currentConnections: 0
  localSpec: McpServerSpec
  remoteSpec: McpManagerServerBody
}
