import type { McpManager } from '../entities'
import { assert, createParser } from '@unshared/validation'

export const assertMcpManager = createParser({
  id: assert.stringUuid,
  address: assert.stringNotEmpty,
  identity: assert.stringNotEmpty,
}) as (value: unknown) => asserts value is McpManager
