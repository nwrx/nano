import type { Flow } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user/utils/assertUser'
import { assertFlowPermission } from './assertFlowPermission'

export const assertFlow = createParser({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  data: createParser({
    version: assert.stringNotEmpty,
    nodes: assert.object,
    metadata: assert.object,
  }),
  assignments: [
    [assert.undefined],
    [assert.arrayOf({
      user: [[assert.undefined], [assertUser]],
      permission: assertFlowPermission,
    })],
  ],
}) as (value: unknown) => asserts value is Flow
