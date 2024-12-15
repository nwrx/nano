import type { OpenAPIV3 } from 'openapi-types'
import type { InputOption } from '../utils'
import type { Thread } from './createThread'
import { resolveSchema } from '../utils'
import { getComponent } from './getComponent'
import { getInputSocket } from './getInputSocket'
import { getInstance } from './getInstance'

export async function getInputOptions(thread: Thread, id: string, name: string, query?: string): Promise<InputOption[]> {
  const instance = getInstance(thread, id)
  const component = await getComponent(thread, id)
  const socket = await getInputSocket(thread, id, name)

  // --- If `x-options` is provided as an array, use it as the options.
  if (typeof socket['x-options'] === 'function') {
    const input = await resolveSchema({
      data: instance.input,
      schema: component.inputs,
      resolvers: thread.referenceResolvers,
      skipErrors: true,
    })
    return socket['x-options'](input, query)
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
