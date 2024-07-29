import { assertBoolean, createParser } from 'unshared'
import { defineChainType } from '../chain'

export const coreTypeBoolean = defineChainType({
  name: 'core:boolean',
  label: 'Boolean',
  color: '#5032BD',
  parse: createParser(assertBoolean),
  description: 'A binary value that is either true or false.',
})
