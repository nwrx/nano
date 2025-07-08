import type { ProviderParameter } from './defineProviderOptions'
import { Validator } from 'jsonschema'

/**
 * Processes a provider parameter mapping to extract and validate its value from the provided parameters.
 *
 * @param definition The provider parameter mapping containing the name and schema of the parameter.
 * @param parameters The parameters object containing potential values for the parameter.
 * @returns The validated value of the parameter.
 */
export function getParameterValue(definition: ProviderParameter, parameters: Record<string, unknown>): unknown {
  const { name, schema = {} } = definition

  // --- Get the value from the parameters.
  let value = parameters[name]
  if (value === undefined) {
    if (schema.default !== undefined)
      value = schema.default
    else if (schema.required)
      throw new Error(`Required path parameter "${name}" is missing.`)
    else
      return undefined // If no value and not required, return undefined.
  }

  // --- Validate the value against the schema if provided.
  if (schema) {
    const validator = new Validator()
    validator.addSchema(schema, `#/definitions/${name}`)
    const result = validator.validate(value, schema)
    if (!result.valid) {
      const errors = result.errors.map(error => error.stack).join(', ')
      throw new Error(`Invalid value for path parameter "${name}": ${errors}`)
    }
  }

  // --- Return the validated or default value.
  return value
}
