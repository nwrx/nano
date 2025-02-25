import * as YAML from 'yaml'
import { defineComponent } from '../../utils/defineComponent'

export const stringify = defineComponent(
  {
    isTrusted: true,
    inputs: {
      format: {
        'title': 'Format',
        'default': 'json',
        'x-control': 'select',
        'enum': [
          'json',
          'yaml',
        ] as const,
        'x-enum-labels': [
          'JSON',
          'YAML',
        ],
        'x-enum-icons': [
          'https://api.iconify.design/carbon:json.svg',
          'https://api.iconify.design/carbon:yaml.svg',
        ],
        'x-enum-descriptions': [
          'The output string will be in JSON format.',
          'The output string will be in YAML format.',
        ],
      },
      object: {
        type: 'object',
        title: 'Object',
        description: 'The object to serialize. It should be a key-value map object.',
      },
    },
    outputs: {
      value: {
        type: 'string',
        name: 'String',
        description: 'The serialized JSON string.',
      },
    },
  },
  ({ data }) => ({
    value: data.format === 'yaml'
      ? YAML.stringify(data.object, { indent: 2 })
      : JSON.stringify(data.object, undefined, 2),
  }),
)
