import { assert, createArrayParser, createSchema } from '@unshared/validation'
import { assertProjectPermission } from './assertProjectPermission'

export const assertProject = createSchema({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  assignments: [
    [assert.undefined],
    [createArrayParser({
      user: [[assert.undefined], [createSchema({ id: assert.stringUuid })]],
      permission: assertProjectPermission,
    })],
  ],
})
