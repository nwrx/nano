import type { Asserted } from '@unshared/types'
import { assert } from '@unshared/validation'

export const REGISTRY_CATEGORY_TYPES = [
  'Purpose',
  'Industry',
  'Technology',
  'Featured',
] as const

/** Asserts that the given value is a valid `Project` permission. */
export const assertRegistryCategoryType = assert.stringEnum(...REGISTRY_CATEGORY_TYPES)

/** The permission that a user has on a project. */
export type RegistryCategoryType = Asserted<typeof assertRegistryCategoryType>
