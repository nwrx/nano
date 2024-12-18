import { defineComponent } from '../utils/defineComponent'

export const template = defineComponent(
  {
    title: 'Template',
    icon: 'https://api.iconify.design/carbon:text-indent.svg',
    description: 'This node generates a templated string based on the provided input. Specifically, it replaces special `{{ Variable }}` placeholders in the template with corresponding values from the input data.',
    inputs: {
      template: {
        'type': 'string',
        'title': 'Template',
        'default': '',
        'description': 'The template for generating the string.',
        'x-control': 'textarea',
      },
      values: {
        'type': 'object',
        'title': 'Values',
        'additionalProperties': { type: 'string' },
        'description': 'The values for the template variables.',
        'x-control': 'table',
      },
    },
    outputs: {
      compiled: {
        type: 'string',
        title: 'Compiled',
        description: 'The compiled string generated from the template.',
      },
    },
  },
  ({ data }) => {
    const { template, values = {} } = data
    const EXP_VAR_REGEX = /{{\s*(\w+\??)\s*}}/g
    return {
      compiled: template.replaceAll(EXP_VAR_REGEX, (_, key: string) => {
        if (key in values === false) return ''
        if (typeof values[key] !== 'string') return ''
        return values[key]
      }),
    }
  },
)
