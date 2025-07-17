import type { Loose } from '@unshared/types'
import { assert, createParser } from '@unshared/validation'
import { assertMcpServerTransportType } from './assertMcpServerTransportType'

/** Asserts the specification of the transport for an MCP server. */
export const assertMcpServerTransport = createParser({
  type: assertMcpServerTransportType,
  port: [
    [assert.null],
    [assert.undefined],
    [assert.numberInteger, assert.numberPositive, assert.numberInRange(1, 65535)],
    [assert.stringNumber, Number.parseInt, assert.numberInRange(1, 65535)],
  ],
})

/** The transport specification of an MCP server. */
export type McpServerTransport = Loose<ReturnType<typeof assertMcpServerTransport>>
