import type { Type } from '@nwrx/core'
import { defineNode } from '@nwrx/core'
import { categoryBasic } from '../categories'
import { object, string } from '../types'

/** The regular expression for extracting variables from the template. */
const EXP_VAR_REGEX = /{{\s*(\w+\??)\s*}}/g

export const nodeTemplate = defineNode({
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
      type: object as Type<Record<string, string>>,
      name: 'Values',
      control: 'socket',
      description: 'The values for the template variables.',
      isOptional: true,
      // properties: ({ data }) => {
      //   const properties: InputSchema = {}
      //   const { template = '' } = data as ObjectLike<string>
      //   const matches = template.match(EXP_VAR_REGEX) ?? []
      //   for (const match of matches) {
      //     const key = match.slice(2, -2).trim()
      //     if (key === '') continue
      //     if (key === 'template') continue
      //     properties[key] = {
      //       name: key,
      //       type: string,
      //       control: 'socket',
      //       isOptional: key.endsWith('?') as unknown as false,
      //       description: `The value for the template variable '${key}'.`,
      //     }
      //   }
      // }
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
  process: ({ input }) => {
    const { template, values = {} } = input

    // --- Replace the variables in the template with the values.
    const compiled = template.replaceAll(EXP_VAR_REGEX, (_, key: string) => {
      if (key === 'template') return ''
      return key in values ? values[key] : ''
    })

    // --- Return the compiled string.
    return { compiled }
  },
})
