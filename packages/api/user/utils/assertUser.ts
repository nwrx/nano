import type { User } from '../entities'
import { assert, createSchema } from '@unshared/validation'

export const assertUser = createSchema({
  id: assert.stringUuid,
  username: assert.stringNotEmpty,
  isSuperAdministrator: [[assert.nil], [assert.boolean]],
}) as (value: unknown) => User
