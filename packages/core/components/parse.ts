import * as YAML from 'yaml'
import { defineComponent } from '../utils/defineComponent'

export const parse = defineComponent(
  {
    isTrusted: true,
    inputs: {
      format: {
        'title': 'Format',
        'default': 'json',
        'description': 'The format of the input string to parse.',
        'x-control': 'select',
        'x-optional': true,
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
          'The input string is in JSON format.',
          'The input is a YAML string.',
        ],
      },
      value: {
        type: 'string',
        title: 'String',
        default: '{}',
        description: 'The input string to parse. It can be either a JSON or YAML formatted string, depending on the selected format.',
      },
    },
    outputs: {
      object: {
        type: 'object',
        name: 'Object',
        description: 'The parsed JSON object as a key-value map.',
      },
    },
  },
  ({ data }) => ({
    object: data.format === 'yaml'
      ? YAML.parse(data.value) as Record<string, unknown>
      : JSON.parse(data.value) as Record<string, unknown>,
  }),
)
