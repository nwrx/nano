import type { McpGateway } from '../entities'
import { assert, createParser } from '@unshared/validation'

export const assertMcpGateway = createParser({
  id: assert.stringUuid,
  address: assert.stringNotEmpty,
  identity: assert.stringNotEmpty,
}) as (value: unknown) => asserts value is McpGateway
