import type { Type } from '@nwrx/core'
import { defineNode } from '@nwrx/core'
import { categoryBasic } from '../categories'
import { boolean, string } from '../types'

export const nodeGate = defineNode({
  kind: 'core/gate',
  name: 'Gate',
  icon: 'https://api.iconify.design/tabler:logic-and.svg',
  description: 'Routes a value based on a condition.',
  category: categoryBasic,

  inputSchema: {
    condition: {
      type: string as Type<'and' | 'nand' | 'nor' | 'not' | 'or' | 'xor'>,
      name: 'Condition',
      control: 'select',
      description: 'The type of the logic gate.',
      options: [
        {
          value: 'and',
          label: 'AND',
          icon: 'https://api.iconify.design/tabler:logic-and.svg',
          description: 'Evaluates to true if all conditions are true.',
        },
        {
          value: 'or',
          label: 'OR',
          icon: 'https://api.iconify.design/tabler:logic-or.svg',
          description: 'Evaluates to true if at least one condition is true.',
        },
        {
          value: 'not',
          label: 'NOT',
          icon: 'https://api.iconify.design/tabler:logic-not.svg',
          description: 'Negates the condition.',
        },
        {
          value: 'nand',
          label: 'NAND',
          icon: 'https://api.iconify.design/tabler:logic-nand.svg',
          description: 'Negates the AND condition.',
        },
        {
          value: 'nor',
          label: 'NOR',
          icon: 'https://api.iconify.design/tabler:logic-nor.svg',
          description: 'Negates the OR condition.',
        },
        {
          value: 'xor',
          label: 'XOR',
          icon: 'https://api.iconify.design/tabler:logic-xor.svg',
          description: 'Evaluates to true if exactly one condition is true.',
        },
      ],
    },
    a: {
      type: boolean,
      name: 'A',
      control: 'socket',
      description: 'The first value to compare.',
    },
    b: {
      type: boolean,
      name: 'B',
      control: 'socket',
      description: 'The second value to compare.',
    },
    value: {
      type: string,
      name: 'Value',
      description: 'The value to route based on the condition',
    },
  },

  outputSchema: {
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

  process: ({ input }) => {
    const { condition, value } = input
    return {
      success: condition ? value : undefined,
      failure: condition ? undefined : value,
    }
  },
})
