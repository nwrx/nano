import type { McpServer } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { assertMcpServerSpec } from './assertMcpServerSpec'

export const assertMcpServer = createParser({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  spec: assertMcpServerSpec,
}) as (value: unknown) => asserts value is McpServer
