import type { OpenAPIV3 } from 'openapi-types'
import type { ReferenceResolver } from './resolveReference'
import { ERRORS as E } from './errors'
import { resolveSchema } from './resolveSchema'

export async function resolveSchemaOneOf(
  path: string,
  value: unknown,
  schemas: OpenAPIV3.SchemaObject[],
  resolvers: ReferenceResolver[] = [],
): Promise<unknown> {
  const errors: Error[] = []
  for (const subSchema of schemas) {
    try { return await resolveSchema(path, value, subSchema, resolvers) }
    catch (error) { errors.push(error as Error) }
  }
  throw E.INPUT_NOT_ONE_OF(path, errors)
}
