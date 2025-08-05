import type { Runner } from '../entities'
import { assert, createParser } from '@unshared/validation'

export const assertRunner = createParser({
  id: assert.stringUuid,
  name: assert.string,
  address: assert.string,
  token: [[assert.undefined], [assert.stringNotEmpty]],
  disabledAt: [[assert.nil], [assert.instanceOf(Date)]],
}) as (value: unknown) => asserts value is Runner
