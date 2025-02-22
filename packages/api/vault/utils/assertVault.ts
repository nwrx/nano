import type { Encrypted } from '../../utils'
import { assert, createArrayParser, createSchema } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertVaultPermission } from './assertVaultPermission'
import { assertVaultType } from './assertVaultType'

export const assertVault = createSchema({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  type: assertVaultType,
  description: [[assert.undefined], [assert.string]],
  configuration: assert.object as (value: unknown) => asserts value is Encrypted,
  assignments: [
    [assert.undefined],
    [createArrayParser({
      user: [[assert.undefined], [assertUser]],
      permission: assertVaultPermission,
    })],
  ],
})
