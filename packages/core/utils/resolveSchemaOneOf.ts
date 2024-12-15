import type { OpenAPIV3 } from 'openapi-types'
import type { ReferenceResolver } from './resolveReference'
import { ERRORS as E } from './errors'
import { resolveSchemaValue } from './resolveSchemaValue'

export async function resolveSchemaOneOf(value: unknown, schemas: OpenAPIV3.SchemaObject[], resolvers: ReferenceResolver[] = []): Promise<unknown> {
  const errors: Error[] = []
  for (const subSchema of schemas) {
    try { return await resolveSchemaValue(value, subSchema, resolvers) }
    catch (error) { errors.push(error as Error) }
  }
  throw E.INPUT_NOT_ONE_OF(errors)
}
