import type { SocketListOption } from '../module'
import type { Thread } from '../thread'
import { getComponentInstance } from './getComponentInstance'
import { resolveComponent } from './resolveComponent'
import { resolveSchema } from './resolveSchema'

export async function getComponentInstanceValueOptions(thread: Thread, id: string, key: string, query?: string): Promise<SocketListOption[]> {
  const componentInstance = getComponentInstance(thread, id)
  const component = await resolveComponent(componentInstance.kind, thread.componentResolvers)
  const schema = component.inputSchema
  const socket = schema?.[key]
  const options = socket?.options

  // --- Assert that the schema and socket exist.
  if (typeof options !== 'function') return options ?? []
  const input = await resolveSchema({
    data: componentInstance.input,
    schema: component.inputSchema,
    resolvers: thread.referenceResolvers,
    skipErrors: true,
  })
  return options(input, query)
}
