import { defineFlowModule } from '../defineFlowModule'
import { defineFlowNode } from '../defineFlowNode'
import { defineFlowType } from '../defineFlowType'

export const typeString = defineFlowType({
  kind: 'string',
  name: 'String',
  parse: (value) => {
    if (typeof value === 'string') return value
    throw new Error('Expected value to be a string.')
  },
})

export const typeObject = defineFlowType({
  kind: 'object',
  name: 'Object',
  parse: (value) => {
    if (typeof value === 'object' && value !== null) return value
    throw new Error('Expected value to be an object.')
  },
})

export const typeNumber = defineFlowType({
  kind: 'number',
  name: 'Number',
  parse: (value) => {
    if (typeof value === 'number') return value
    throw new Error('Expected value to be a number.')
  },
})

export const typeBoolean = defineFlowType({
  kind: 'boolean',
  name: 'Boolean',
  parse: (value) => {
    if (typeof value === 'boolean') return value
    throw new Error('Expected value to be a boolean.')
  },
})

export const nodeParseNumber = defineFlowNode({
  kind: 'parse-number',
  name: 'Parse Number',
  icon: 'https://api.iconify.design/carbon:parse.svg',
  description: 'Parses a string into a number.',

  defineDataSchema: {
    string: {
      name: 'String',
      type: typeString,
      description: 'The string to parse into a number.',
    },
  },

  defineResultSchema: {
    number: {
      name: 'Number',
      type: typeNumber,
      description: 'The number that was parsed from the string.',
    },
  },

  process: ({ data }) => ({
    number: Number.parseFloat(data.string),
  }),
})

export const nodeParseBoolean = defineFlowNode({
  kind: 'parse-boolean',
  name: 'Parse Boolean',
  icon: 'https://api.iconify.design/carbon:parse.svg',
  description: 'Parses a string into a boolean.',
  defineDataSchema: {
    string: {
      name: 'String',
      type: typeString,
      description: 'The string to parse into a boolean.',
    },
  },
  defineResultSchema: {
    boolean: {
      name: 'Boolean',
      type: typeBoolean,
      description: 'The boolean that was parsed from the string.',
    },
  },
  process: ({ data }) => ({
    boolean: /^(true|1)$/i.test(data.string),
  }),
})

export const moduleExample = defineFlowModule({
  kind: 'example',
  name: 'Example',
  nodes: {
    nodeParseNumber,
    nodeParseBoolean,
  },
  types: {
    typeString,
    typeNumber,
    typeBoolean,
  },
})
