import { defineComponent } from '../../utils/defineComponent'

export const template = defineComponent(
  {
    isTrusted: true,
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
        'additionalProperties': {
          oneOf: [
            { type: 'string' },
            { type: 'number' },
            { type: 'boolean' },
          ],
        },
        'description': 'The values for the template variables.',
        'x-control': 'table',
      },
    },
    outputs: {
      value: {
        type: 'string',
        title: 'Compiled',
        description: 'The compiled string generated from the template.',
      },
    },
  },
  ({ data }) => {
    const { template, values } = data
    let compiled = ''
    let remaining = template

    // --- Iterate over the template string and replace placeholders.
    while (true) {
      const start = remaining.indexOf('{{')
      if (start === -1) {
        compiled += remaining
        break
      }

      // Append everything before the placeholder
      compiled += remaining.slice(0, start)

      // Move past the opening {{
      remaining = remaining.slice(start + 2)

      const end = remaining.indexOf('}}')
      if (end === -1) throw new Error('Unbalanced placeholder: missing "}}"')

      // Extract the inside of the placeholder
      const variableContent = remaining.slice(0, end).trim()
      // Move past the closing }}
      remaining = remaining.slice(end + 2)

      // Parse variableContent
      let variableName = variableContent
      let defaultValue: string | undefined
      let isOptional = false

      // --- If '??' is present, extract the default value and variable name.
      const defaultIndex = variableContent.indexOf('??')
      if (defaultIndex !== -1) {
        variableName = variableContent.slice(0, defaultIndex).trim()
        const defaultPart = variableContent.slice(defaultIndex + 2).trim()
        // Attempt to parse a quoted default value
        defaultValue = (defaultPart.startsWith('"') && defaultPart.endsWith('"'))
        || (defaultPart.startsWith('\'') && defaultPart.endsWith('\''))
          ? defaultPart.slice(1, -1)
          : defaultPart
      }

      // --- Check if optional (ending with "?"), if so, remove the "?" and mark as optional.
      if (variableName.endsWith('?')) {
        isOptional = true
        variableName = variableName.slice(0, -1).trim()
      }

      // --- Attempt to replace from values
      const value = values[variableName]
      if (value !== undefined && value !== null)
        compiled += value
      else if (defaultValue !== undefined)
        compiled += defaultValue
      else if (!isOptional)
        throw new Error(`Input "${variableName}" is required but was not provided.`)
    }

    // --- Return the compiled string.
    return { value: compiled }
  },
)
