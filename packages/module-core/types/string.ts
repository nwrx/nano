import { defineType } from '@nwrx/nano'
import { assertBoolean, assertNumber, assertObject, assertString, createParser } from '@unshared/validation'

export const string = defineType({
  kind: 'string',
  name: 'String',
  color: '#927721',
  defaultValue: '',
  description: 'A sequence of characters.',
  parse: createParser(
    [assertNumber, (value: number) => value.toFixed(2)],
    [assertBoolean, (value: boolean) => (value ? 'true' : 'false')],
    [assertObject, JSON.stringify],
    [assertString],
  ),
})
