import type { LooseDeep } from '@unshared/types'
import { assert, createParser } from '@unshared/validation'
import { assertMcpServerTransport } from './assertMcpServerTransport'

/** Asserts the specification of an MCP pool. This is used to define the resources and limits of the pool. */
export const assertMcpServerSpec = createParser({
  image: [
    [assert.stringNotEmpty],
  ],
  command: [
    [assert.undefined],
    [assert.string, (value: string) => value.split(' ').map(s => s.trim()).filter(s => s.length > 0)],
    [assert.arrayOf(assert.string)],
  ],
  idleTimeout: [
    [assert.undefined],
    [assert.numberInteger, assert.numberPositive],
    [assert.stringNumber, Number.parseInt, assert.numberPositive],
  ],
  transport: [
    [assert.undefined],
    [assertMcpServerTransport],
  ],
})

/** The specification of an MCP pool. This is used to define the resources and limits of the pool. */
export type McpServerSpec = LooseDeep<ReturnType<typeof assertMcpServerSpec>>
