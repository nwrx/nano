import { defineFlowType } from '@nanoworks/core'
import { assertObject, createParser } from '@unshared/validation'

export const typeObject = defineFlowType({
  kind: 'object',
  name: 'Object',
  color: '#BD3249',
  description: 'A collection of key-value pairs.',
  parse: createParser(assertObject<Record<string, unknown>>),
})
