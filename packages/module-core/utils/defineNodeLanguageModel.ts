import type { InstanceContext, SocketListOption, Type } from '@nwrx/core'
import type { ObjectLike } from '@unshared/types'
import type { InferenceResult } from '../nodes'
import type { LanguageModel, LanguageModelOnDataContext } from '../types'
import type { OpenaiChatRequest } from './OpenaiChatRequest'
import type { OpenaiChatResponse } from './OpenaiChatResponse'
import { defineDataSchema, defineNode } from '@nwrx/core'
import { categoryLanguageModel } from '../categories'
import { languageModel, string } from '../types'
import { openaiGetBody } from './openaiGetBody'
import { openaiGetModels } from './openaiGetModels'

export interface LanguageModelNodeData {
  baseUrl: string
  model: string
  token: string
}

interface Options<T = ObjectLike, U = ObjectLike>
  extends Partial<Pick<LanguageModel<T, U>, 'getBody' | 'onData' | 'onError' >> {
  kind: string
  name?: string
  icon?: string
  description?: string
  defaultUrl?: string
  defaultModel?: string
  pathModels?: string
  pathCompletions?: string
  getModels?: (data: LanguageModelNodeData, abortSignal: AbortSignal) => Promise<Array<SocketListOption<string>>>
}

async function DEFAULT_ON_DATA(
  context: LanguageModelOnDataContext<OpenaiChatRequest, OpenaiChatResponse>,
): Promise<InferenceResult | void> {
  const { body, data, call, resume } = context
  const { choices: [choice], id, usage } = data as unknown as OpenaiChatResponse

  // --- Handle tool calls returned by the model.
  if (choice.finish_reason === 'tool_calls') {
    if (choice.message.role !== 'assistant') throw new Error('The assistant message was not provided.')
    if (!choice.message.tool_calls) throw new Error('The tool calls were not provided.')
    const toolResultPromises = choice.message.tool_calls.map(async(toolCall) => {
      const name = toolCall.function.name
      const parameters = JSON.parse(toolCall.function.arguments) as Record<string, unknown>
      const result = await call(name, parameters)
      body.messages.push(choice.message, {
        role: 'tool',
        content: JSON.stringify(result),
        tool_call_id: toolCall.id,
      })
    })
    await Promise.all(toolResultPromises)
    return resume()
  }

  // --- Stop the completion.
  if (choice.finish_reason === 'stop') {
    if (choice.message.role !== 'assistant') throw new Error('The assistant message was not provided.')
    const completion = Array.isArray(choice.message.content) ? choice.message.content.join('\n') : choice.message.content
    return {
      id,
      completion: completion ?? '',
      tokensTotal: usage.total_tokens,
      tokensPrompt: usage.prompt_tokens,
      tokensCompletion: usage.completion_tokens,
    }
  }
}

async function DEFAULT_ON_ERROR(response: Response) {
  try {
    const data = await response.json() as { error: { message: string } }
    return data.error.message
  }
  catch {
    return `OpenAI: ${response.statusText}`
  }
}

/**
 * Wrapper around the {@linkcode defineNode} function that creates a standardized
 * language model node for a specific API. The function takes-in several options
 * that streamline the process of adapting the node to different inference providers.
 *
 * @param options The options for creating the language model node.
 * @returns The language model node.
 */
export function defineNodeLanguageModel<T, U>(options: Options<T, U>) {
  const {
    kind,
    name,
    icon,
    description,
    defaultUrl,
    defaultModel,
    pathModels = '/models',
    pathCompletions = '/chat/completions',
    onData = DEFAULT_ON_DATA,
    onError = DEFAULT_ON_ERROR,
    getBody = openaiGetBody,
    getModels = openaiGetModels(pathModels),
  } = options

  return defineNode({
    kind,
    name,
    icon,
    description,
    category: categoryLanguageModel,

    dataSchema: async({ data, abortSignal }: InstanceContext) => defineDataSchema({
      baseUrl: {
        name: 'URL',
        type: string,
        control: 'variable',
        description: 'The base URL for the inference provider.',
        defaultValue: defaultUrl,
        isInternal: Boolean(defaultUrl),
        isOptional: Boolean(defaultUrl),
      },
      token: {
        name: 'API Key',
        type: string,
        control: 'variable',
        description: 'The API Key used to authenticate with the inference provider.',
        isOptional: true,
      },
      model: {
        type: string,
        control: 'select',
        name: 'Model',
        defaultValue: defaultModel,
        description: 'The name of the model to use for generating completions.',
        options: await getModels(data as LanguageModelNodeData, abortSignal).catch(() => []),
        isOptional: true,
      },
    }),

    resultSchema: {
      model: {
        name: 'Model',
        type: languageModel as Type<LanguageModel<T, U>>,
        description: 'The model information to use for generating completions.',
      },
    },

    process: ({ data }) => ({
      model: {
        url: new URL(pathCompletions, data.baseUrl).toString(),
        model: data.model,
        token: data.token,
        getBody,
        onError,
        onData,
      } as LanguageModel<T, U>,
    }),
  })
}
