/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { OutputSchema } from '@nwrx/nano'
import type { OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types'
import { createNodeSocket } from './createNodeSocket'

export function createOutputSchema(operation: OpenAPI.Operation): OutputSchema {
  const outputSchema: OutputSchema = {}

  // --- Find the first OK response and extract the schema.
  for (const status in operation.responses) {
    const code = Number.parseInt(status)
    if (code < 200 || code >= 300) continue

    // --- Will attempt to access the schema property. Abort if not found.
    const schema = 'schema' in operation.responses[status]!
      ? operation.responses[status]?.schema as OpenAPIV2.SchemaObject
    // @ts-expect-error: will abort if the schema property is not found.
      : operation.responses[status]?.content?.['application/json']?.schema as OpenAPIV3.SchemaObject
    if (!schema) continue

    // --- When the schema is an object, we create a separate output for each property.
    // @ts-expect-error: ignore
    outputSchema.data = {
      ...createNodeSocket(schema),
      name: 'Data',
      description: 'The output data as an object.',
    }

    // --- We only process the first OK response.
    break
  }
  return outputSchema
}
