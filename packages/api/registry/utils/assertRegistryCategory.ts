import type { RegistryCategory } from '../entities'
import { assert, createSchema } from '@unshared/validation'
import { assertRegistryCategoryType } from './assertRegistryCategoryType'

export const assertRegistryCategory = createSchema({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  type: assertRegistryCategoryType,
}) as (value: unknown) => RegistryCategory
