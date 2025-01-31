import type { FlowSchema } from '@nanoworks/core'
import { defineFlowNode } from '@nanoworks/core'
import { typeString } from './typeString'

export const nodeTemplate = defineFlowNode({
  kind: 'template',
  name: 'Template',
  icon: 'https://api.iconify.design/carbon:template.svg',
  description: 'A template for generating a string based on the input.',

  // --- Create the data schema that infers the variables from the template.
  defineDataSchema: ({ data }) => {
    const { template = '' } = data as { template: string }

    // --- Define the schema for the template and its variables.
    const dataSchema = {
      template: {
        name: 'Template',
        type: typeString,
        display: 'textarea',
        disallowDynamic: true,
        description: 'The template for generating the string.',
      },
    } satisfies FlowSchema

    // --- Extract the variables from the template.
    const matches = template.match(/{{\s*(\w+)\s*}}/g) ?? []
    for (const match of matches) {
      const key = match.slice(2, -2).trim()
      if (key === '') continue
      if (key === 'template') continue
      // @ts-expect-error: Allow dynamic keys.
      dataSchema[key] = {
        name: key,
        type: typeString,
        display: 'text',
        description: `The value for the variable '{{${key}}}'.`,
      }
    }

    // --- Return the computed data schema.
    return dataSchema
  },

  // --- Define the result schema that returns the compiled string.
  defineResultSchema: {
    compiled: {
      name: 'Compiled',
      type: typeString,
    },
  },

  // --- Process the template by replacing the variables with the values.
  process: ({ data }) => {
    const { template = '', ...values } = data as Record<string, string>

    // --- Replace the variables in the template with the values.
    let compiled = template
    const matches = template.match(/{{(\w+)}}/g) ?? []
    matches.forEach((match) => {
      const key = match.slice(2, -2)
      compiled = compiled.replace(match, values[key] ?? '')
    })

    return { compiled }
  },
})
