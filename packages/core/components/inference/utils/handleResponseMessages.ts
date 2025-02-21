import type { ObjectLike } from '@unshared/types'
import type { LanguageModelMessage } from './languageModelMessageSchema'
import type { LanguageModelRequestContext } from './languageModelSchema'
import { getNodeData } from '../../../thread'
import { INFERENCE_ERRORS as E } from './errors'

export interface EventToolRequest {
  id: string
  name: string
  description: string
  parameters: ObjectLike
}

export interface EventToolResult {
  id: string
  result: ObjectLike
}

export interface EventToolError {
  id: string
  error: Error
}

export async function handleResponseMessages(context: LanguageModelRequestContext, ...messages: LanguageModelMessage[]): Promise<void> {
  const { tools, thread, nodeId } = context

  const promises = messages.map(async(message) => {
    if (message.role === 'assistant') {
      context.messages.push(message)
    }

    else if (message.role === 'tool_request') {
      const { id, name, input } = message

      // --- Assert the requested tool is provided.
      if (tools.length === 0) throw E.INFERENCE_ON_RESPONSE_TOOL_REQUEST_MISSING_TOOLS()
      const tool = tools.find(tool => tool.name === name)
      if (!tool) throw E.INFERENCE_ON_RESPONSE_TOOL_REQUEST_TOOL_NOT_FOUND(name)

      // --- Get the current input of the tool and merge it with the provided input.
      const data = await getNodeData(thread, tool.nodeId, { skipErrors: true })
      const parameters = Object.assign({}, data.parameters, input)

      // --- Call the tool and notify the result.
      try {
        thread.dispatch('nodeToolRequest', nodeId, { id, name, description: tool.description, parameters })
        const result = await tool.call(input)
        thread.dispatch('nodeToolResponse', nodeId, { id, result })
        context.messages.push(message, { role: 'tool_result', id, isError: false, result })
      }

      // --- If an error occurs, notify the error and rethrow it.
      catch (error) {
        thread.dispatch('nodeToolError', nodeId, { id, error: error as Error } )
        context.messages.push(message, { role: 'tool_result', id, isError: true, result: { error: (error as Error).message } })
      }
    }
    else {
      throw new Error(`Invalid message role: ${message.role}`)
    }
  })
  await Promise.all(promises)
}
