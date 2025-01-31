import { defineComponent } from '@nwrx/nano'
import { getServerUrl, type Operation, resolveOperationTokenOptions } from '@unshared/client/openapi'
import { parseRequest } from '@unshared/client/utils'
import { toSlug } from '@unshared/string'
import { createInputSchema } from './createInputSchema'
import { createOutputSchema } from './createOutputSchema'

export interface CreateNodesOptions {
  moduleKind?: string
}

function extractParametersFromData(data: object, parameters: Operation['parameters'], filterIn: string) {
  const entries = Object.entries(data)
    .filter(([key]) => parameters!.some(parameter => 'in' in parameter && parameter.in === filterIn && parameter.name === key))
  return entries.length === 0 ? undefined : Object.fromEntries(entries)
}

/**
 * Given the URL of an OpenAPI specification and an operation ID, create a node
 * that can be used to call the operation and infer the input and output schema.
 *
 * @param document The OpenAPI document.
 * @param operation The operation to create a node for.
 * @param options The options to create the node with.
 * @returns The node definition for the OpenAPI operation.w
 */
export function createNode(document: object, operation: Operation, options: CreateNodesOptions = {}) {
  const { moduleKind = 'core' } = options
  const { path, method, operationId, summary, description, parameters } = operation
  const kind = operationId ? toSlug(operationId) : toSlug(method, path)

  return defineComponent({
    kind: `${moduleKind}/${kind}`,
    name: summary ?? operationId,
    description: description ?? summary ?? operationId,
    inputSchema: createInputSchema(document, operation),
    outputSchema: createOutputSchema(operation),
    process: async({ data }) => {

      // --- Find the operation in the OpenAPI specification.
      const { token, ...additionalData } = data as { token?: string; [key: string]: unknown }
      const baseUrl = getServerUrl(document)
      const tokenOptions = resolveOperationTokenOptions(document, operation)

      // --- Fetch the relevant resource from the server.
      const { method, path, responses = {} } = operation
      const { url, init } = parseRequest(path, {
        method,
        baseUrl,
        token,
        body: extractParametersFromData(additionalData, parameters, 'body'),
        query: extractParametersFromData(additionalData, parameters, 'query'),
        headers: extractParametersFromData(additionalData, parameters, 'header'),
        ...tokenOptions,
      })

      const response = await globalThis.fetch(url, init)
      if (response.ok) return { data: await response.json() }

      // --- Throw an error if the response was not successful.
      const status = response.status.toString()
      if (status in responses
        && typeof responses[status] === 'object'
        && responses[status] !== null
        && 'description' in responses[status]
        && typeof responses[status].description === 'string')
        throw new Error(responses[status].description)

      // --- Throw a generic error if the response was not successful.
      throw new Error(response.statusText)
    },
  })
}
