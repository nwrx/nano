import { defineComponent } from '../utils/defineComponent'

export const gate = defineComponent(
  {
    isTrusted: true,
    name: 'gate',
    purpose: 'control',
    icon: 'carbon:plug',
    title: {
      en: 'Logic Gate',
      fr: 'Porte Logique',
      de: 'Logikgatter',
      es: 'Puerta Lógica',
      zh: '逻辑门',
    },
    description: {
      en: 'Control flow based on logical conditions using AND, OR, XOR, NAND, NOR, and XNOR gates.',
      fr: 'Contrôler le flux basé sur des conditions logiques en utilisant les portes AND, OR, XOR, NAND, NOR et XNOR.',
      de: 'Flusssteuerung basierend auf logischen Bedingungen mit AND-, OR-, XOR-, NAND-, NOR- und XNOR-Gattern.',
      es: 'Controlar el flujo basado en condiciones lógicas usando puertas AND, OR, XOR, NAND, NOR y XNOR.',
      zh: '使用AND、OR、XOR、NAND、NOR和XNOR门基于逻辑条件控制流程。',
    },
    inputs: {
      condition: {
        'title': 'Condition',
        'description': 'The type of the logic gate.',
        'x-control': 'select',
        'enum': ['and', 'or', 'xor', 'nand', 'nor', 'xnor'] as const,
        'x-enum-labels': ['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'],
        'x-enum-icons': [
          'tabler:logic-and',
          'tabler:logic-or',
          'tabler:logic-xor',
          'tabler:logic-nand',
          'tabler:logic-nor',
          'tabler:logic-xnor',
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
