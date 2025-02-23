import type { Flow } from '../entities'
import { assert, createArrayParser, createSchema } from '@unshared/validation'
import { assertUser } from '../../user/utils/assertUser'
import { assertFlowPermission } from './assertFlowPermission'

export const assertFlow = createSchema({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  data: createSchema({
    version: assert.stringNotEmpty,
    nodes: assert.object,
    metadata: assert.object,
  }),
  assignments: [
    [assert.undefined],
    [createArrayParser({
      user: [[assert.undefined], [assertUser]],
      permission: assertFlowPermission,
    })],
  ],
}) as (value: unknown) => asserts value is Flow
