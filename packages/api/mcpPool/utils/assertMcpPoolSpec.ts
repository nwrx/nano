import type { Loose } from '@unshared/types'
import { assert, createParser } from '@unshared/validation'

/** Asserts the specification of an MCP pool. This is used to define the resources and limits of the pool. */
export const assertMcpPoolSpec = createParser({
  maxServersActive: [
    [assert.undefined],
    [assert.numberInteger, assert.numberPositive],
    [assert.stringNumber, Number.parseInt, assert.numberPositive],
  ],
  defaultIdleTimeout: [
    [assert.undefined],
    [assert.numberInteger, assert.numberPositive],
    [assert.stringNumber, Number.parseInt, assert.numberPositive],
  ],
  maxServersLimit: [
    [assert.undefined],
    [assert.numberInteger, assert.numberPositive],
    [assert.stringNumber, Number.parseInt, assert.numberPositive],
  ],
})

/** The specification of an MCP pool. This is used to define the resources and limits of the pool. */
export type McpPoolSpec = Loose<ReturnType<typeof assertMcpPoolSpec>>
