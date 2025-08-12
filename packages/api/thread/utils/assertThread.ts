import type { Thread } from '../entities'
import { assert, createParser } from '@unshared/validation'

export const assertThread = createParser({
  id: assert.stringUuid,
}) as (value: unknown) => asserts value is Thread
