import type { InputSocket } from '@nwrx/nano'
import type { OpenAPI } from 'openapi-types'
import { resolveOperationTokenOptions } from '@unshared/client/openapi'
import { toTitleCase } from '@unshared/string'
import { string } from '../types'
import { createNodeSocket } from './createNodeSocket'

export function createInputSchema(document: object, operation: OpenAPI.Operation): InputSocket {
  const inputSchema: InputSocket = {}

  // --- If there is a `apiKey` security scheme, add an `token` input.
  const tokenOptions = resolveOperationTokenOptions(document, operation)
  if (tokenOptions.tokenLocation) {
    inputSchema.token = {
      type: string,
      name: 'API Key',
      description: 'The API key to use for authentication.',
      control: 'variable',
    }
  }

  // --- Iterate over the parameters and create the input schema.
  if (!operation.parameters) return inputSchema
  for (const parameter of operation.parameters) {
    if ('$ref' in parameter) continue

    // --- If parameter is an `Authroization` header, we use it as the token.
    if (parameter.in === 'header' && parameter.name.toLowerCase() === 'authorization') {
      inputSchema.token = {
        type: string,
        name: 'API Key',
        description: 'The authorization token to use for authentication.',
        control: 'variable',
      }
      continue
    }

    // @ts-expect-error: ignore
    inputSchema[parameter.name] = {
      ...createNodeSocket(parameter.schema as object),
      name: toTitleCase(parameter.name),
      description: parameter.description,
      isOptional: true,
      isInternal: parameter.in === 'header',
    }
  }

  return inputSchema
}
