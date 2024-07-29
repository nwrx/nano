import { assertObject, createParser } from 'unshared'
import { defineChainType } from '../chain'

export const coreTypeObject = defineChainType({
  name: 'core:object',
  label: 'Object',
  color: '#BD3249',
  parse: createParser(assertObject as (value: unknown) => asserts value is Record<string, unknown>),
  description: 'A collection of key-value pairs.',
})
