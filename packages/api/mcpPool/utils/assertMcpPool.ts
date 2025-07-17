import type { McpPool } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { assertMcpManager } from '../../mcpManager/utils/assertMcpManager'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'
import { assertMcpPoolSpec } from './assertMcpPoolSpec'

export const assertMcpPool = createParser({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  spec: assertMcpPoolSpec,
  workspace: [[assert.undefined], [assertWorkspace]],
  manager: [[assert.undefined], [assert.null], [assertMcpManager]],
}) as (value: unknown) => asserts value is McpPool
