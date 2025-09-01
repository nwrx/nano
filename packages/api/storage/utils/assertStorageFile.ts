import type { StorageFile } from '../entities'
import { assert, createParser } from '@unshared/validation'

export const assertStorageFile = createParser({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  size: assert.numberInteger,
  type: assert.stringNotEmpty,
}) as (value: unknown) => asserts value is StorageFile
