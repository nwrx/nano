import type { MaybePromise, ObjectLike } from '@unshared/types'
import type { Schema } from './defineComponent'
import type { Tool } from './toolSchema'

export interface ToolOptions {
  name: string
  description?: string
  properties: Record<string, Schema>
  call: (parameters: any) => MaybePromise<ObjectLike>
}

/**
 * Creates a tool that can be used by a node to extend it's functionality.
 * Typically used with an LLM to provide additional functionality.
 *
 * @param nodeId The ID of the node that the tool is associated with.
 * @param options The specification of the tool.
 * @returns The new {@linkcode Tool} object.
 * @example
 * const tool = defineTool(nodeId, {
 *   name: 'weather-forecast',
 *   description: 'Get the weather forecast for a location.',
 *   parameters: { location: { type: 'string' } },
 *   call: ({ location }) => Promise.resolve({ weather: 'sunny' }),
 * })
 */
export function defineTool(nodeId: string, options: ToolOptions): Tool {
  return {
    nodeId,
    call: options.call,
    name: options.name,
    description: options.description,
    parameters: {
      type: 'object',
      required: Object.keys(options.properties),
      additionalProperties: false,
      properties: options.properties,
    },
  }
}
