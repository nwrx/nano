import type { DataSchema, InstanceContext } from '@nwrx/core'
import type { ObjectLike } from '@unshared/types'
import { defineNode } from '@nwrx/core'
import { defineDataSchema } from '@nwrx/core'
import { categoryBasic } from '../categories'
import { string } from '../types'

/** The regular expression for extracting variables from the template. */
const EXP_VAR_REGEX = /{{\s*(\w+\??)\s*}}/g

export const nodeTemplate = defineNode({
  kind: 'core/template',
  name: 'Template',
  icon: 'https://api.iconify.design/carbon:text-indent.svg',
  description: 'This node generates a templated string based on the provided input. Specifically, it replaces special `{{ Variable }}` placeholders in the template with corresponding values from the input data.',
  category: categoryBasic,

  // --- Create the data schema that infers the variables from the template.
  dataSchema: ({ data }: InstanceContext) => {
    const dataSchema: DataSchema = defineDataSchema({
      template: {
        type: string,
        name: 'Template',
        control: 'textarea',
        description: 'The template for generating the string.',
      },
    })

    // --- Extract the variables from the template.
    const { template = '' } = data as ObjectLike<string>
    const matches = template.match(EXP_VAR_REGEX) ?? []
    for (const match of matches) {
      const key = match.slice(2, -2).trim()
      if (key === '') continue
      if (key === 'template') continue
      dataSchema[key] = {
        name: key,
        type: string,
        control: 'socket',
        isOptional: key.endsWith('?') as unknown as false,
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
  process: ({ data }: InstanceContext) => {
    const { template } = data as ObjectLike<string>

    // --- Replace the variables in the template with the values.
    const compiled = template.replaceAll(EXP_VAR_REGEX, (_, key: string) => {
      if (key === 'template') return ''
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return key in data ? data[key] : ''
    })

    // --- Return the compiled string.
    return { compiled }
  },
})
