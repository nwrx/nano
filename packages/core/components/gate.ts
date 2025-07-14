import { defineComponent } from '../utils/defineComponent'

export const gate = defineComponent(
  {
    isTrusted: true,
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
      pass: {
        'name': 'Pass',
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
      fail: {
        'name': 'Fail',
        'description': 'The value when the condition is false.',
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

    if (condition === 'and') {
      return values.every(Boolean)
        ? { pass: passthrough, fail: undefined }
        : { pass: undefined, fail: passthrough }
    }

    if (condition === 'or') {
      return values.some(Boolean)
        ? { pass: passthrough, fail: undefined }
        : { pass: undefined, fail: passthrough }
    }

    if (condition === 'xor') {
      return values.filter(Boolean).length === 1
        ? { pass: passthrough, fail: undefined }
        : { pass: undefined, fail: passthrough }
    }

    if (condition === 'nand') {
      return values.every(Boolean)
        ? { pass: undefined, fail: passthrough }
        : { pass: passthrough, fail: undefined }
    }

    if (condition === 'nor') {
      return values.some(Boolean)
        ? { pass: undefined, fail: passthrough }
        : { pass: passthrough, fail: undefined }
    }

    if (condition === 'xnor') {
      // all are true or all are false
      const all = values.every(Boolean)
      const any = values.some(Boolean)
      return (all || !any)
        ? { pass: passthrough, fail: undefined }
        : { pass: undefined, fail: passthrough }
    }

    // --- Unrecognized condition, should (hopefully) never occur.
    throw new Error(`Unrecognized condition: ${condition as string}`)
  },
)
