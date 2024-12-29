import type { MaybePromise, ObjectLike } from '@unshared/types'
import type { Schema } from './defineComponent'
import type { Tool } from './toolSchema'

export interface ToolOptions {
  name: string
  description: string
  properties: Record<string, Schema>
  call: (parameters: any) => MaybePromise<ObjectLike>
}

/**
 * Creates a tool that can be used by a node to extend it's functionality.
 *
 * @param nodeId The ID of the node that the tool is associated with.
 * @param tool The specification of the tool.
 * @returns The created tool object.
 */
export function defineTool(nodeId: string, tool: ToolOptions): Tool {
  return {
    nodeId,
    call: tool.call,
    name: tool.name,
    description: tool.description,
    parameters: {
      type: 'object',
      required: Object.keys(tool.properties),
      additionalProperties: false,
      properties: tool.properties,
    },
  }
}
