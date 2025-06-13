import type { RegistryCategory } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { assertRegistryCategoryType } from './assertRegistryCategoryType'

export const assertRegistryCategory = createParser({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  type: assertRegistryCategoryType,
}) as (value: unknown) => RegistryCategory
