import * as YAML from 'yaml'
import { defineComponent } from '../utils/defineComponent'

export const parse = defineComponent(
  {
    isTrusted: true,
    title: 'Parse JSON/YAML',
    icon: 'https://api.iconify.design/carbon:data-format.svg',
    description: 'This node parses a given string into an object. It supports both JSON and YAML formats, allowing users to specify the format of the input string. The parsed result is returned as a key-value map object.',
    inputs: {
      format: {
        'title': 'Format',
        'default': 'json',
        'x-control': 'select',
        'x-optional': true,
        'oneOf': [
          {
            'type': 'string',
            'enum': ['json'] as const,
            'title': 'JSON',
            'description': 'The input string is in JSON format.',
            'x-icon': 'https://api.iconify.design/carbon:json.svg',
          },
          {
            'type': 'string',
            'title': 'YAML',
            'enum': ['yaml'] as const,
            'description': 'The input is a YAML string.',
            'x-icon': 'https://api.iconify.design/carbon:yaml.svg',
          },
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
  ({ data }) => {
    const { format, value } = data
    return {
      object: format === 'yaml'
        ? YAML.parse(value) as Record<string, unknown>
        : JSON.parse(value) as Record<string, unknown>,
    }
  },
)
