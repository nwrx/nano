import { assertString, createParser } from 'unshared'
import { defineChainType } from '../chain'

export const coreTypeString = defineChainType({
  name: 'core:string',
  label: 'String',
  color: '#2FDF10',
  parse: createParser(assertString),
  description: 'A sequence of characters.',
})
