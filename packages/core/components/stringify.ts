import * as YAML from 'yaml'
import { defineComponent } from '../utils/defineComponent'

export const stringify = defineComponent(
  {
    isTrusted: true,
    title: 'Stringify JSON/YAML',
    icon: 'https://api.iconify.design/carbon:data-format.svg',
    description: 'This node serializes an object into a JSON or YAML formatted string. Users can specify the format of the output string, which can be either JSON or YAML. The input object is expected to be a key-value map object.',
    inputs: {
      format: {
        'title': 'Format',
        'default': 'json',
        'x-control': 'select',
        'oneOf': [
          {
            'type': 'string',
            'title': 'JSON',
            'enum': ['json'] as const,
            'description': 'The output string will be in JSON format.',
            'x-icon': 'https://api.iconify.design/carbon:json.svg',
          },
          {
            'type': 'string',
            'title': 'YAML',
            'enum': ['yaml'] as const,
            'description': 'The output string will be in YAML format.',
            'x-icon': 'https://api.iconify.design/carbon:yaml.svg',
          },
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
  ({ data }) => {
    const { format, object } = data
    return {
      value: format === 'yaml'
        ? YAML.stringify(object, { indent: 2 })
        : JSON.stringify(object, undefined, 2),
    }
  },
)
