import { defineType } from '@nwrx/core'
import { assertObject, assertString, createRuleSet } from '@unshared/validation'

export const object = defineType({
  kind: 'object',
  name: 'Object',
  color: '#BD3249',
  description: 'A collection of key-value pairs.',
  parse: createRuleSet(
    [assertObject<Record<string, unknown>>],
    [assertString, value => JSON.parse(value as string) as Record<string, unknown>],
    [(value: unknown) => ({ value } as Record<string, unknown>)],
  ),
})
