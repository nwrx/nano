import type { RegistryComponent } from '../entities'
import { assert, createArrayParser, createSchema } from '@unshared/validation'
import { assertRegistryCategory } from './assertRegistryCategory'
import { assertRegistryCollection } from './assertRegistryCollection'

export const assertRegistryComponent = createSchema({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  collection: assertRegistryCollection,
  categories: createArrayParser(assertRegistryCategory),
}) as (value: unknown) => RegistryComponent
