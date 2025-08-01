import { defineComponent } from '../utils/defineComponent'

export const input = defineComponent(
  {
    isTrusted: true,
    name: 'input',
    purpose: 'control',
    icon: 'carbon:port-input',
    title: {
      en: 'Input',
      fr: 'Entrée',
      de: 'Eingabe',
      es: 'Entrada',
      zh: '输入',
    },
    description: {
      en: 'Define input parameters for the flow execution.',
      fr: 'Définir les paramètres d\'entrée pour l\'exécution du flux.',
      de: 'Eingabeparameter für die Flussausführung definieren.',
      es: 'Definir parámetros de entrada para la ejecución del flujo.',
      zh: '为流程执行定义输入参数。',
    },
    inputs: {
      name: {
        'type': 'string',
        'title': 'Name',
        'description': 'The name of the input property. This is the name that will be used to reference the input in the flow.',
        'x-control': 'text',
        'example': 'Give your input a name',
      },
      description: {
        'type': 'string',
        'title': 'Description',
        'description': 'A description of the input property. This is used to provide more information about the input and its purpose in the flow.',
        'x-optional': true,
        'x-control': 'textarea',
        'example': 'Describe the input property',
      },
      required: {
        'type': 'boolean',
        'title': 'Optional',
        'description': 'Whether the input is required to be provided in the flow. If set to true, the input will be required to be provided in the flow. If set to false, the input will be optional.',
        'default': false,
        'x-control': 'select',
        'oneOf': [
          {
            type: 'boolean',
            enum: [true] as const,
            title: 'Required',
            description: 'The input is required to be provided in the flow.',
          },
          {
            type: 'boolean',
            enum: [false] as const,
            title: 'Optional',
            description: 'The input is optional to be provided in the flow.',
          },
        ],
      },
    },
    outputs: {
      value: {
        'type': 'string',
        'name': 'Value',
        'description': 'The value of the entrypoint.',
        'x-optional': true,
      },
    },
  },
  ({ data, thread }) => {
    const { name, required } = data

    const value = thread.input[name]
    if (required && value === undefined)
      throw new Error(`Input "${name}" is required but not provided.`)

    if (value instanceof ReadableStream)
      throw new Error(`Input "${name}" is a stream and cannot be used as an input.`)

    if (value instanceof File)
      throw new Error(`Input "${name}" is a file and cannot be used as an input'`)

    return {
      value: value === undefined
        ? undefined
        : String(value),
    }
  },
)
