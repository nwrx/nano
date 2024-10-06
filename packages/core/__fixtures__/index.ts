import { defineFlowCategory } from '../defineFlowCategory'
import { defineFlowModule } from '../defineFlowModule'
import { defineFlowNode } from '../defineFlowNode'
import { defineFlowType } from '../defineFlowType'

export const categoryBasic = defineFlowCategory({
  kind: 'basic',
  name: 'Basic',
  icon: 'https://api.iconify.design/carbon:basic.svg',
  description: 'A collection of basic nodes for working with data.',
})

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

export const nodeInput = defineFlowNode({
  kind: 'input',
  name: 'Input',
  icon: 'https://api.iconify.design/carbon:arrow-down.svg',
  category: categoryBasic,
  description: 'A value generated from an entrypoint in the flow.',

  defineDataSchema: {
    property: {
      name: 'Property',
      display: 'text',
      type: typeString,
      disallowDynamic: true,
      description: 'The name of the entrypoint.',
    },
  },

  defineResultSchema: () => ({
    value: {
      name: 'Value',
      type: typeString,
      description: 'The value of the entrypoint.',
    },
  }),

  process: ({ flow, data }) => {
    flow.on('flow:input', (property) => {
      if (property !== data.property) return
    })
  },
})

export const nodeOutput = defineFlowNode({
  kind: 'output',
  name: 'Output',
  icon: 'https://api.iconify.design/carbon:arrow-up.svg',
  category: categoryBasic,
  description: 'A value that is sent to an exitpoint in the flow.',

  defineDataSchema: () => ({
    property: {
      name: 'Property',
      display: 'text',
      type: typeString,
      disallowDynamic: true,
      description: 'The name of the exitpoint.',
    },
    value: {
      name: 'Value',
      type: typeString,
      description: 'The value to send to the exitpoint.',
    },
  }),

  process: ({ flow, data }) => {
    if (!data.value) return
    if (!data.property) return
    flow.dispatch('flow:output', data.property, data.value)
  },
})

export const nodeJsonParse = defineFlowNode({
  kind: 'parse-json',
  name: 'JSON Parse',
  icon: 'https://api.iconify.design/carbon:json.svg',
  description: 'Parses a JSON string into an object.',

  defineDataSchema: {
    json: {
      name: 'JSON',
      type: typeString,
    },
  },

  defineResultSchema: {
    object: {
      name: 'Object',
      type: typeObject,
    },
  },

  process: ({ data }) => {
    const { json = '{}' } = data
    return { object: JSON.parse(json) as Record<string, unknown> }
  },
})

export const moduleCore = defineFlowModule({
  kind: 'nwrx/core',
  name: 'Core',
  nodes: [
    nodeJsonParse,
    nodeOutput,
    nodeInput,
  ],
  types: [
    typeString,
    typeObject,
  ],
})
