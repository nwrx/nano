import * as YAML from 'yaml'
import { defineComponent } from '../utils/defineComponent'

export const stringify = defineComponent(
  {
    isTrusted: true,
    name: 'stringify',
    purpose: 'processing',
    icon: 'carbon:string-text',
    title: {
      en: 'Stringify',
      fr: 'Sérialiser',
      de: 'Stringifizieren',
      es: 'Serializar',
      zh: '序列化',
    },
    description: {
      en: 'Convert objects to JSON or YAML string format.',
      fr: 'Convertir des objets au format de chaîne JSON ou YAML.',
      de: 'Objekte in JSON- oder YAML-String-Format konvertieren.',
      es: 'Convertir objetos a formato de cadena JSON o YAML.',
      zh: '将对象转换为JSON或YAML字符串格式。',
    },
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
          'carbon:json',
          'carbon:yaml',
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
