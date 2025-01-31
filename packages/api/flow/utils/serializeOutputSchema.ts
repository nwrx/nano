import type { OutputSchema } from '@nwrx/nano'

export interface OutputJSON {
  key: string
  name: string
  typeKind: string
  typeName?: string
  typeColor?: string
  typeDescription?: string
  description?: string
}

export function serializeOutputSchema(schema?: OutputSchema): OutputJSON[] {
  if (!schema) return []
  return Object
    .entries(schema)
    .map(([key, socket]) => ({
      key,
      name: socket.name ?? key,
      typeKind: socket.type?.kind,
      typeName: socket.type?.name,
      typeColor: socket.type?.color,
      typeDescription: socket.type?.description,
      description: socket.description,
    }))
}
