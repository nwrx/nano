import type { VaultVariable } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { assertVault } from './assertVault'

export const assertVaultVariable = createParser({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  vault: [[assert.undefined], [assertVault]],
  data: assert.objectStrict,
}) as (value: unknown) => asserts value is VaultVariable
