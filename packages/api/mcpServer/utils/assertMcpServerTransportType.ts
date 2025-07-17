import type { Asserted } from '@unshared/types'
import { assert } from '@unshared/validation'

export const MCP_SERVER_TRANSPORT_TYPES = [
  'stdio',
  'sse',
  'streamable-http',
] as const

/** Asserts that the given value is a valid MCP transport type. */
export const assertMcpServerTransportType = assert.stringEnum(...MCP_SERVER_TRANSPORT_TYPES)

/** The type of MCP transport. */
export type McpServerTransportType = Asserted<typeof assertMcpServerTransportType>
