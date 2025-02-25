import type { RegistryCollection } from '../entities'
import { assert, createSchema } from '@unshared/validation'

export const assertRegistryCollection = createSchema({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
}) as (value: unknown) => RegistryCollection
