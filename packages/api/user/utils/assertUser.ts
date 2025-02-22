import { assert, createSchema } from '@unshared/validation'

export const assertUser = createSchema({
  id: assert.stringUuid,
  username: assert.stringNotEmpty,
  isSuperAdministrator: [[assert.nil], [assert.boolean]],
})
