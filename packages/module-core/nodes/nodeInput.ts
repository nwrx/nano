import { defineComponent, NODE_INPUT_KIND } from '@nwrx/nano'
import { categoryBasic } from '../categories'
import { boolean, string } from '../types'

export const nodeInput = defineComponent({
  kind: NODE_INPUT_KIND,
  name: 'Input',
  icon: 'https://api.iconify.design/carbon:arrow-down.svg',
  category: categoryBasic,
  description: 'A value generated from an entrypoint in the flow. The value can be any type of data, such as a string, number, or boolean and is provided as an input to the flow.',

  inputSchema: {
    name: {
      type: string,
      name: 'Name',
      control: 'text',
      description: 'The name of the input property. This is the name that will be used to reference the input in the flow.',
    },
    description: {
      type: string,
      name: 'Description',
      control: 'text',
      description: 'A description of the input property. This is used to provide more information about the input and its purpose in the flow.',
      isOptional: true,
    },
    isOptional: {
      name: 'Optional',
      type: boolean,
      control: 'radio',
      description: 'If checked, the input is optional and the flow will continue even if no value is provided.',
      defaultValue: false,
      options: [
        { value: false, label: 'Required' },
        { value: true, label: 'Optional' },
      ],
    },
  },

  outputSchema: {
    value: {
      name: 'Value',
      type: string,
      description: 'The value of the entrypoint.',
      isOptional: true,
    },
  },

  process: ({ data, result }) => {
    const { name, isOptional } = data

    // --- The result of this node is set by the `Flow` instance on startup. This is why there is
    // --- almost no processing here. The value is simply passed through.
    const { value } = result

    // --- If the input is required but no value was provided, throw an error.
    if (!isOptional && !value)
      throw new Error(`The input "${name}" is required but no value was provided.`)

    // --- Passthrough the value.
    return { value }
  },
})
