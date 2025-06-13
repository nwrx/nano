import type { User } from '../entities'
import { assert, createParser } from '@unshared/validation'

export const assertUser = createParser({
  id: assert.stringUuid,
  username: assert.stringNotEmpty,
  isSuperAdministrator: [[assert.nil], [assert.boolean]],
}) as (value: unknown) => User
