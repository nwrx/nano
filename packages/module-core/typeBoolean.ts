import { defineFlowType } from '@nanoworks/core'
import { assertBoolean, createParser } from '@unshared/validation'

export const typeBoolean = defineFlowType({
  kind: 'boolean',
  name: 'Boolean',
  color: '#3386CF',
  parse: createParser(assertBoolean),
  description: 'A binary value that is either true or false.',
})
