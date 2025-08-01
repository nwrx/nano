import { defineComponent } from '../utils/defineComponent'

export const passthrough = defineComponent(
  {
    isTrusted: true,
    name: 'passthrough',
    purpose: 'processing',
    icon: 'carbon:flow-stream',
    title: {
      en: 'Passthrough',
      fr: 'Passage',
      de: 'Durchgang',
      es: 'Paso',
      zh: '传递',
    },
    description: {
      en: 'Pass data through without modification, useful for routing and debugging.',
      fr: 'Faire passer les données sans modification, utile pour le routage et le débogage.',
      de: 'Daten unverändert durchleiten, nützlich für Routing und Debugging.',
      es: 'Pasar datos sin modificación, útil para enrutamiento y depuración.',
      zh: '不修改地传递数据，对路由和调试很有用。',
    },
    inputs: {
      value: {
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
      value: {
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
  },
  ({ data }) => ({
    value: data.value,
  }),
)
