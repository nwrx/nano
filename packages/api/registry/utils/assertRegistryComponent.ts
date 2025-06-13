import type { RegistryComponent } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { assertRegistryCategory } from './assertRegistryCategory'
import { assertRegistryCollection } from './assertRegistryCollection'

export const assertRegistryComponent = createParser({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  collection: assertRegistryCollection,
  categories: assert.arrayOf(assertRegistryCategory),
}) as (value: unknown) => RegistryComponent
