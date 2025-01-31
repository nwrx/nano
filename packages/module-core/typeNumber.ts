import { defineFlowType } from '@nwrx/core'
import { assertNumber, assertStringNumber, createParser } from '@unshared/validation'

export const typeNumber = defineFlowType({
  kind: 'number',
  name: 'Number',
  color: '#FF1648',
  description: 'A floating-point number with a decimal point.',
  parse: createParser(
    [assertNumber],
    [assertStringNumber, Number.parseFloat],
  ),
})
