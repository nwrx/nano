import { defineComponent } from '../../utils/defineComponent'

export const gate = defineComponent(
  {
    title: 'Gate',
    icon: 'https://api.iconify.design/tabler:logic-and.svg',
    description: 'Routes a value based on a condition.',
    inputs: {
      condition: {
        'title': 'Condition',
        'description': 'The type of the logic gate.',
        'x-control': 'select',
        'enum': ['and', 'or', 'xor', 'nand', 'nor', 'xnor'] as const,
        'x-enum-labels': ['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'],
        'x-enum-icons': [
          'https://api.iconify.design/tabler:logic-and.svg',
          'https://api.iconify.design/tabler:logic-or.svg',
          'https://api.iconify.design/tabler:logic-xor.svg',
          'https://api.iconify.design/tabler:logic-nand.svg',
          'https://api.iconify.design/tabler:logic-nor.svg',
          'https://api.iconify.design/tabler:logic-xnor.svg',
        ],
        'x-enum-descriptions': [
          'Evaluates to true if all conditions are true.',
          'Evaluates to true if any condition is true.',
          'Evaluates to true if only one condition is true.',
          'Evaluates to false if all conditions are true.',
          'Evaluates to false if any condition is true.',
          'Evaluates to true if all conditions are the same.',
        ],
      },
      values: {
        type: 'array',
        title: 'Values',
        description: 'The first value to compare.',
        items: { type: 'boolean' },
      },
      passthrough: {
        title: 'Value',
        default: true,
        description: 'The value to route based on the condition',
        oneOf: [
          { type: 'array' },
          { type: 'object' },
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
          { 'x-type': 'stream' },
        ],
      },
    },
    outputs: {
      result: {
        'name': 'Gate',
        'description': 'The value when the condition is true.',
        'x-optional': true,
        'oneOf': [
          { type: 'array' },
          { type: 'object' },
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
          { 'x-type': 'stream' },
        ],
      },
    },
  },
  ({ data }) => {
    const { condition, values, passthrough } = data
    let ok = false
    if (condition === 'and' && values.every(Boolean)) ok = true
    if (condition === 'or' && values.some(Boolean)) ok = true
    if (condition === 'xor' && values.filter(Boolean).length === 1) ok = true
    if (condition === 'nand' && !values.every(Boolean)) ok = true
    if (condition === 'nor' && !values.some(Boolean)) ok = true
    if (condition === 'xnor' && values.every(Boolean) || !values.some(Boolean)) ok = true
    return { result: ok ? passthrough : undefined }
  },
)
