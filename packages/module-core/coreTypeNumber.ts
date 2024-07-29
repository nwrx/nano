import { assertNumber, createParser } from 'unshared'
import { defineChainType } from '../chain'

export const coreTypeNumber = defineChainType({
  name: 'core:number',
  label: 'Number',
  color: '#B8BD32',
  parse: createParser(assertNumber),
  description: 'A floating-point number with a decimal point.',
})
