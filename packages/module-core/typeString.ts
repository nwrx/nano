import { defineFlowType } from '@nwrx/core'
import { assertBoolean, assertNumber, assertObject, assertString, createParser } from '@unshared/validation'

export const typeString = defineFlowType({
  kind: 'string',
  name: 'String',
  color: '#F3CA40',
  description: 'A sequence of characters.',
  parse: createParser(
    [assertString],
    [assertNumber, String],
    [assertBoolean, String],
    [assertObject, JSON.stringify],
  ),
})
