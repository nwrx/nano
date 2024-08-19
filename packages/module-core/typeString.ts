import { defineFlowType } from '@nanoworks/core'
import { assertString, createParser } from '@unshared/validation'

export const typeString = defineFlowType({
  kind: 'string',
  name: 'String',
  color: '#F3CA40',
  parse: createParser(assertString),
  description: 'A sequence of characters.',
})
