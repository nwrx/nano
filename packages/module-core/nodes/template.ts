import type { NodeInstanceContext } from '@nwrx/core'
import { defineNode } from '@nwrx/core'
import { defineDataSchema } from '@nwrx/core'
import { basic } from '../categories'
import { string } from '../types'

/** The regular expression for extracting variables from the template. */
const EXP_VAR_REGEX = /{{\s*(\w+)\s*}}/g

export const template = defineNode({
  kind: 'template',
  name: 'Template',
  icon: 'https://api.iconify.design/carbon:template.svg',
  description: 'A template for generating a string based on the input.',
  category: basic,

  // --- Create the data schema that infers the variables from the template.
  dataSchema: ({ data }: NodeInstanceContext) => {
    const dataSchema = defineDataSchema<Record<string, string>>({
      template: {
        type: string,
        name: 'Template',
        control: 'textarea',
        description: 'The template for generating the string.',
      },
    })

    // --- Extract the variables from the template.
    const { template = '' } = data as { template: string }
    const matches = template.match(EXP_VAR_REGEX) ?? []
    for (const match of matches) {
      const key = match.slice(2, -2).trim()
      if (key === '') continue
      if (key === 'template') continue
      dataSchema[key] = {
        name: key,
        type: string,
        control: 'socket',
        description: `The value for the template variable '${key}'.`,
      }
    }

    // --- Return the computed data schema.
    return dataSchema
  },

  // --- Define the result schema that returns the compiled string.
  resultSchema: {
    compiled: {
      type: string,
      name: 'Compiled',
      description: 'The compiled string generated from the template.',
    },
  },

  // --- Process the template by replacing the variables with the values.
  process: ({ data }) => {
    const { template = '' } = data

    // --- Replace the variables in the template with the values.
    const compiled = template.replaceAll(EXP_VAR_REGEX, (_, key: string) => {
      if (key === 'template') return ''
      if (key in data) return (data as Record<string, string>)[key]
      return ''
    })

    // --- Return the compiled string.
    return { compiled }
  },
})
