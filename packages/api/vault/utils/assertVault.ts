import type { Encrypted } from '../../utils'
import type { Vault } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertVaultPermission } from './assertVaultPermission'
import { assertVaultType } from './assertVaultType'

export const assertVault = createParser({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  type: assertVaultType,
  description: [[assert.undefined], [assert.string]],
  configuration: assert.object as (value: unknown) => asserts value is Encrypted,
  assignments: [
    [assert.undefined],
    [assert.arrayOf({
      user: [[assert.undefined], [assertUser]],
      permission: assertVaultPermission,
    })],
  ],
}) as (value: unknown) => asserts value is Vault
