import type { OpenAPIV3 } from 'openapi-types'
import type { InputOption } from '../utils'
import type { Thread } from './createThread'
import { getNodeData } from './getNodeData'
import { getNodeInputSocket } from './getNodeInputSocket'

export async function getNodeInputOptions(thread: Thread, id: string, name: string, query?: string): Promise<InputOption[]> {
  const socket = await getNodeInputSocket(thread, id, name)

  // --- If `x-options` is provided, use it as the options.
  if (typeof socket['x-options'] === 'function') {
    const data = await getNodeData(thread, id, { skipErrors: true })
    return socket['x-options'](data, query)
  }

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
  if (Array.isArray(socket.enum))
    return socket.enum.map(value => ({ value: String(value), label: String(value) }))

  // --- Fallback to an empty array.
  return []
}
