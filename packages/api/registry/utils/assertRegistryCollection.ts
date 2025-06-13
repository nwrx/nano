import type { RegistryCollection } from '../entities'
import { assert, createParser } from '@unshared/validation'

export const assertRegistryCollection = createParser({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
}) as (value: unknown) => RegistryCollection
