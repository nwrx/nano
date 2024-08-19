import { defineFlowType } from '@nanoworks/core'
import { assertNumber, createParser } from '@unshared/validation'

export const typeNumber = defineFlowType({
  kind: 'number',
  name: 'Number',
  color: '#FF1648',
  parse: createParser(assertNumber),
  description: 'A floating-point number with a decimal point.',
})
