import type { Encrypted } from '../../utils'
import type { StoragePool } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { assertStoragePoolType } from './assertStoragePoolType'

export const assertStoragePool = createParser({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  type: assertStoragePoolType,
  description: [[assert.undefined], [assert.string]],
  configuration: assert.object as (value: unknown) => asserts value is Encrypted,
}) as (value: unknown) => asserts value is StoragePool
