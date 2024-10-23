import { defineNode } from '@nwrx/core'
import { basic, categoryText } from '../categories'
import { boolean, string } from '../types'

export const stringText = defineNode({
  kind: 'text',
  name: 'Text',
  icon: 'https://api.iconify.design/carbon:string-text.svg',
  description: 'A static text node that outputs the given text.',
  category: categoryText,

  dataSchema: {
    text: {
      type: string,
      name: 'Text',
      control: 'textarea',
      description: 'The text to output.',
    },
  },

  resultSchema: {
    text: {
      type: string,
      name: 'Text',
      description: 'The text output.',
    },
  },

  process: ({ data }) => ({
    text: data.text.trim(),
  }),
})

export const logicGate = defineNode({
  kind: 'gate',
  name: 'Gate',
  icon: 'https://api.iconify.design/carbon:gate.svg',
  description: 'Routes a value based on a condition.',
  category: basic,

  dataSchema: {
    condition: {
      type: boolean,
      name: 'Condition',
      control: 'socket',
      description: 'The condition to evaluate.',
    },
    value: {
      type: string,
      name: 'Value',
      control: 'socket',
      description: 'The value to route.',
    },
  },

  resultSchema: {
    success: {
      type: string,
      name: 'Success',
      isOptional: true,
      description: 'The value when the condition is true.',
    },
    failure: {
      type: string,
      name: 'Failure',
      isOptional: true,
      description: 'The value when the condition is false.',
    },
  },

  process: ({ data }) => {
    const { condition, value } = data
    return {
      success: condition ? value : undefined,
      failure: condition ? undefined : value,
    }
  },
})

export const logicAny = defineNode({
  kind: 'any',
  name: 'Any',
  icon: 'https://api.iconify.design/carbon:any.svg',
  description: 'Outputs the first non-empty value.',
  category: basic,

  dataSchema: {
    value1: {
      type: string,
      name: 'Value 1',
      control: 'socket',
      description: 'The first value.',
      isOptional: true,
    },
    value2: {
      type: string,
      name: 'Value 2',
      control: 'socket',
      description: 'The second value.',
      isOptional: true,
    },
  },

  resultSchema: {
    value: {
      type: string,
      name: 'Value',
      description: 'The first non-empty value.',
    },
  },

  process: ({ data }) => {
    const { value1, value2 } = data
    return {
      value: value1.trim() || value2.trim(),
    }
  },
})
