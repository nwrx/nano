import { defineNode } from '@nwrx/core'
import { basic } from '../categories'
import { boolean, string } from '../types'

export const match = defineNode({
  kind: 'match',
  name: 'Match',
  icon: 'https://api.iconify.design/carbon:search.svg',
  description: 'Matches a string against a given pattern and routes the flow based on the result.',
  category: basic,

  dataSchema: {
    text: {
      type: string,
      name: 'Text',
      control: 'socket',
      description: 'The text to match against the pattern.',
    },
    pattern: {
      type: string,
      name: 'Pattern',
      control: 'text',
      description: 'The pattern to match the text against.',
    },
  },

  resultSchema: {
    matched: {
      type: boolean,
      name: 'Matched',
      description: 'If the text matched the pattern.',
    },
    hit: {
      type: string,
      name: 'Hit',
      isOptional: true,
      description: 'The matched part of the text.',
    },
    miss: {
      type: string,
      name: 'Miss',
      isOptional: true,
      description: 'The unmatched part of the text.',
    },
  },

  process: ({ data }) => {
    const { text, pattern } = data
    const regex = new RegExp(pattern, 'g')
    const match = regex.test(text)
    return {
      matched: match,
      hit: match ? text : undefined,
      miss: match ? undefined : text,
    }
  },
})

export const not = defineNode({
  kind: 'not',
  name: 'Not',
  icon: 'https://api.iconify.design/carbon:not.svg',
  description: 'Negates a boolean value.',
  category: basic,

  dataSchema: {
    value: {
      type: boolean,
      name: 'Value',
      control: 'socket',
      description: 'The boolean value to negate.',
    },
  },

  resultSchema: {
    result: {
      type: boolean,
      name: 'Result',
      description: 'The negated boolean value.',
    },
  },

  process: ({ data }) => ({
    result: !data.value,
  }),
})
