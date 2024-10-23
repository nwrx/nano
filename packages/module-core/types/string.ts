import { defineType } from '@nwrx/core'
import { assertBoolean, assertNumber, assertObject, assertString, createParser } from '@unshared/validation'

export const string = defineType({
  kind: 'string',
  name: 'String',
  color: '#927721',
  defaultValue: '',
  description: 'A sequence of characters.',
  parse: createParser(
    [assertString],
    [assertNumber, String],
    [assertBoolean, String],
    [assertObject, JSON.stringify],
  ),
})
