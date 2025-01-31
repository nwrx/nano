import { defineSocketType } from '@nwrx/core'
import { assertBoolean, assertNumber, assertObject, assertString, createParser } from '@unshared/validation'

export const string = defineSocketType({
  kind: 'string',
  name: 'String',
  color: '#F3CA40',
  defaultValue: '',
  description: 'A sequence of characters.',
  parse: createParser(
    [assertString],
    [assertNumber, String],
    [assertBoolean, String],
    [assertObject, JSON.stringify],
  ),
})
