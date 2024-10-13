import { defineSocketType } from '@nwrx/core'
import { assertNumber, assertStringNumber, createParser } from '@unshared/validation'

export const number = defineSocketType({
  kind: 'number',
  name: 'Number',
  color: '#FF1648',
  defaultValue: 0,
  description: 'A floating-point number with a decimal point.',
  parse: createParser(
    [assertNumber],
    [assertStringNumber, Number.parseFloat],
  ),
})
