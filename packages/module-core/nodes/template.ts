import type { FlowNodeContext, FlowNodePort, FlowSchema } from '@nwrx/core'
import { defineFlowNode } from '@nwrx/core'
import { basic } from '../categories'
import { string } from '../types'

/** The regular expression for extracting variables from the template. */
const EXP_VAR_REGEX = /{{\s*(\w+)\s*}}/g

export const template = defineFlowNode({
  kind: 'template',
  name: 'Template',
  icon: 'https://api.iconify.design/carbon:template.svg',
  description: 'A template for generating a string based on the input.',
  category: basic,

  // --- Create the data schema that infers the variables from the template.
  defineDataSchema: ({ data }: FlowNodeContext) => {

    // --- Define the schema for the template and its variables.
    const dataSchema = {
      template: {
        name: 'Template',
        type: string,
        display: 'textarea',
        disallowDynamic: true,
        description: 'The template for generating the string.',
      },
    } satisfies FlowSchema

    // --- Extract the variables from the template.
    const { template = '' } = data as { template: string }
    const matches = template.match(EXP_VAR_REGEX) ?? []
    for (const match of matches) {
      const key = match.slice(2, -2).trim()
      if (key === '') continue
      if (key === 'template') continue
      // @ts-expect-error: key is dynamic.
      dataSchema[key] = {
        name: key,
        type: string,
        description: `The value for the template variable '${key}'.`,
      } as FlowNodePort
    }

    // --- Return the computed data schema.
    return dataSchema
  },

  // --- Define the result schema that returns the compiled string.
  defineResultSchema: {
    compiled: {
      name: 'Compiled',
      type: string,
      description: 'The compiled string generated from the template.',
    },
  },

  // --- Process the template by replacing the variables with the values.
  process: ({ data }) => {
    const { template = '' } = data

    // --- Loop through the variables and abort if one is missing.
    const matches = template.match(EXP_VAR_REGEX) ?? []
    for (const match of matches) {
      const key = match.slice(2, -2).trim()
      if (key === '') continue
      if (key === 'template') continue
      if (key in data === false) return
      if (key in data && typeof data[key as keyof typeof data] !== 'string') return
    }

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
