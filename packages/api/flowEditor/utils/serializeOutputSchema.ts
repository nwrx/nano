import type { Schema } from '@nwrx/nano/utils'

export interface OutputJSON {
  key: string
  name: string
  typeKind: string
  typeName?: string
  typeColor?: string
  typeDescription?: string
  description?: string
}

export function serializeOutputSchema(object?: Record<string, Schema>): OutputJSON[] {
  if (!object) return []
  return Object
    .entries(object)
    .map(([key, schema]) => ({
      key,
      name: schema.title ?? key,
      typeKind: typeof schema['x-type'] === 'string' ? schema['x-type'] : String(schema.type),
      typeName: 'schema.type?.name',
      typeColor: 'schema.type?.color',
      typeDescription: 'schema.type?.description',
      description: schema.description,
    }))
}
