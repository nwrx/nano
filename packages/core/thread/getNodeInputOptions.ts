import type { OpenAPIV3 } from 'openapi-types'
import type { SchemaOption } from '../utils'
import type { Thread } from './createThread'
import { getNodeInputSocket } from './getNodeInputSocket'

export async function getNodeInputOptions(thread: Thread, id: string, name: string): Promise<SchemaOption[]> {
  const socket = await getNodeInputSocket(thread, id, name)

  // --- Fallback to the values in `oneOf` if it exists.
  if (Array.isArray(socket.oneOf)) {
    const options = socket.oneOf as OpenAPIV3.NonArraySchemaObject[]
    return options.map((option) => {
      const value = String(option.enum?.[0] as string)
      return {
        value,
        label: option.title ?? value,
        description: option.description,
        icon: 'x-icon' in option ? option['x-icon'] as string : undefined,
      }
    })
  }

  // --- Fallback to the values in `enum` if it exists.
  if (Array.isArray(socket.enum)) {
    return socket.enum.map((value: unknown, index) => ({
      value,
      label: socket['x-enum-labels']?.[index] ?? String(value),
      description: socket['x-enum-descriptions']?.[index],
      icon: socket['x-enum-icons']?.[index],
    }))
  }

  // --- Fallback to an empty array.
  return []
}
