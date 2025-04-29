import type { Tool } from '@modelcontextprotocol/sdk/types.js'
import type { ServiceOptions } from '@unshared/client/createService'
import type { JSONSchema7Definition } from 'json-schema'
import type { OpenAPI } from 'openapi-types'
import type { McpTool } from './defineTool'
import { getServerUrl, resolveDocument, resolveOperationTokenOptions } from '@unshared/client/openapi'
import { handleResponse, parseRequest } from '@unshared/client/utils'
import { tries } from '@unshared/functions'
import { toCamelCase } from '@unshared/string'
import * as YAML from 'yaml'
import { defineTool } from './defineTool'

export function resolveOperationSchema(document: object, operation: OpenAPI.Operation): JSONSchema7Definition {
  const schema: JSONSchema7Definition = { type: 'object' }

  // --- If there is a `apiKey` security scheme, add an `token` input.
  const { tokenLocation, tokenProperty } = resolveOperationTokenOptions(document, operation)
  if (tokenProperty && tokenLocation) {
    schema.properties = schema.properties ?? {}
    schema.properties[tokenProperty] = {
      type: 'string',
      description: 'The API key to use for authentication.',
    }
  }

  if (!operation.parameters) return schema
  for (const parameter of operation.parameters) {
    if ('$ref' in parameter) continue

    // --- If parameter is an `Authroization` header, we use it as the token.
    if (parameter.in === 'header' && parameter.name.toLowerCase() === 'authorization') {
      schema.properties = schema.properties ?? {}
      schema.properties.token = parameter.schema as JSONSchema7Definition
    }

    // --- Otherwise, we add the parameter to the schema.
    else {
      schema.properties = schema.properties ?? {}
      schema.properties[parameter.name] = {
        description: parameter.description,
        ...parameter.schema,
      } as JSONSchema7Definition
      if (parameter.required) {
        schema.required = schema.required ?? []
        schema.required.push(parameter.name)
      }
    }
  }

  // --- Return the schema.
  return schema
}

export function createToolsFromOas<T extends object>(document: T, initialOptions?: ServiceOptions<T>): McpTool[] {
  const documentResolved = resolveDocument(document) as unknown as OpenAPI.Document

  // --- Collect all operations from the OpenAPI document.
  const operations: Array<{ method: string; path: string; operation: OpenAPI.Operation }> = []
  for (const path in documentResolved.paths) {
    const operationsForPath = documentResolved.paths[path] as Record<string, OpenAPI.Operation>
    for (const method in operationsForPath) {
      const operation = operationsForPath[method]
      if (operation.operationId) operations.push({ method, path, operation })
    }
  }

  // --- Create tools from the operations.
  const name = toCamelCase(documentResolved.info.title).replaceAll('Api', '')
  return operations.map(({ method, path, operation }) => defineTool(
    {
      name: [name, operation.operationId!].filter(Boolean).join('/'),
      title: operation.description ?? operation.operationId,
      description: operation.summary ?? operation.description ?? operation.operationId,
      inputSchema: resolveOperationSchema(document, operation) as Tool['inputSchema'],
    },

    async({ input: data }) => {

      // --- Find the operation in the OpenAPI specification.
      const baseUrl = getServerUrl(document)
      const tokenOptions = resolveOperationTokenOptions(document, operation)

      // --- Fetch the relevant resource from the server.
      const { responses = {} } = operation
      // @ts-expect-error: ignore
      const { url, init } = parseRequest(path, { method, baseUrl, data, ...tokenOptions, ...initialOptions })
      const response = await globalThis.fetch(url, init)
      if (response.ok) return handleResponse(response, { ...initialOptions })

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
  )) as McpTool[]
}

export async function createToolsFromRemoteOas(url: string, options?: ServiceOptions): Promise<McpTool[]> {
  const response = await globalThis.fetch(url)
  if (!response.ok) throw new Error(response.statusText)
  const text = await response.text()
  const document = tries(
    () => JSON.parse(text) as OpenAPI.Document,
    () => YAML.parse(text) as OpenAPI.Document,
  )
  if (!document) throw new Error('Failed to parse OpenAPI document.')
  return createToolsFromOas(document, options)
}
