import { assert, createArrayParser, createSchema } from '@unshared/validation'
import { assertWorkspacePermission } from './assertWorkspacePermission'

export const assertWorkspace = createSchema({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  assignments: [
    [assert.undefined],
    [createArrayParser({
      user: [[assert.undefined], [createSchema({ id: assert.stringUuid })]],
      permission: assertWorkspacePermission,
    })],
  ],
})
