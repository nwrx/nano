import { defineComponent } from '@nwrx/nano'
import { categoryBasic } from '../categories'
import { string } from '../types'

/** The regular expression for extracting variables from the template. */
const EXP_VAR_REGEX = /{{\s*(\w+\??)\s*}}/g

export const nodeTemplate = defineComponent({
  kind: 'core/template',
  name: 'Template',
  icon: 'https://api.iconify.design/carbon:text-indent.svg',
  description: 'This node generates a templated string based on the provided input. Specifically, it replaces special `{{ Variable }}` placeholders in the template with corresponding values from the input data.',
  category: categoryBasic,

  // --- Create the data schema that infers the variables from the template.
  inputSchema: {
    template: {
      type: string,
      name: 'Template',
      control: 'textarea',
      description: 'The template for generating the string.',
    },
    values: {
      type: string,
      name: 'Values',
      control: 'map',
      description: 'The values for the template variables.',
      isMap: true,
      isOptional: true,
    },
  },

  // --- Define the result schema that returns the compiled string.
  outputSchema: {
    compiled: {
      type: string,
      name: 'Compiled',
      description: 'The compiled string generated from the template.',
    },
  },

  // --- Process the template by replacing the variables with the values.
  process: ({ data }) => {
    const { template, values = {} } = data

    // --- Replace the variables in the template with the values.
    const compiled = template.replaceAll(EXP_VAR_REGEX, (_, key: string) => {
      if (key === 'template') return ''
      return key in values ? values[key] : ''
    })

    // --- Return the compiled string.
    return { compiled }
  },
})
