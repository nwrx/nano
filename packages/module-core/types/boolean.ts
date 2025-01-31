import { defineFlowType } from '@nwrx/core'
import { parseBoolean } from '@unshared/string'
import { assertBoolean, assertStringNotEmpty, createParser } from '@unshared/validation'

export const boolean = defineFlowType({
  kind: 'boolean',
  name: 'Boolean',
  color: '#3386CF',
  description: 'A binary value that is either true or false.',
  parse: createParser(
    [assertBoolean],
    [assertStringNotEmpty, parseBoolean],
  ),
})
