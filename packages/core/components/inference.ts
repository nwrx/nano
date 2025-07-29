/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { Chat, Provider } from '@nwrx/ai'
import { createClient } from '@nwrx/ai'
import { defineComponent } from '../utils/defineComponent'
import { TOOL_SCHEMA } from '../utils/toolSchema'
import { PROVIDER_SCHEMA } from './provider'

export type EventMapChat = {
  'nodeChatRequest': [nodeId: string, requestId: string, event: Chat.Context]
  'nodeChatResponse': [nodeId: string, requestId: string, event: Chat.Context]
  'nodeChatEvent': [nodeId: string, requestId: string, event: Chat.Event]
  'nodeChatError': [nodeId: string, requestId: string, error: Error]
}

export const inference = defineComponent(
  {
    isTrusted: true,
    inputs: {
      provider: {
        'title': 'Provider',
        'description': 'The provider to use for inference.',
        'x-control': 'reference/provider',
        ...PROVIDER_SCHEMA,
      },
      model: {
        'title': 'Model',
        'description': 'The language model used to generate the completion.',
        'type': 'string',
        'x-control': 'reference/provider-model',
      },
      tools: {
        title: 'Tools',
        description: 'The tools used to generate the completion.',
        default: [],
        type: 'array',
        items: TOOL_SCHEMA,
      },
      messages: {
        title: 'Messages',
        description: 'The message to generate a completion for.',
        default: [],
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: true,
        },
      },
      options: {
        'title': 'Options',
        'description': 'The parameters used by the language model to generate the completion. Each LLM provides a different set of parameters that can be used to customize the inference process.',
        'default': {},
        'x-control': 'table',
        'type': 'object',
        'additionalProperties': true,
      },
    },
    outputs: {
      completion: {
        'title': 'Completion',
        'description': 'The generated completion as a stream of tokens.',
        'x-type': 'stream',
        'x-yields': { type: 'string' },
      },
    },
  },
  async({ data, nodeId, thread }) => {
    const { provider, model, tools, messages, options } = data
    const client = createClient(provider as unknown as Provider, options)

    // --- Pass the events from the provider to the thread.
    client.on('chatRequest', (requestId, context) => thread.dispatch('nodeChatRequest', nodeId, requestId, context))
    client.on('chatResponse', (requestId, context) => thread.dispatch('nodeChatResponse', nodeId, requestId, context))
    client.on('chatEvent', (requestId, event) => thread.dispatch('nodeChatEvent', nodeId, requestId, event))
    client.on('chatError', (requestId, error) => thread.dispatch('nodeChatError', nodeId, requestId, error))

    // --- Generate the completion.
    const completion = await client.generateText({
      model,
      tools,
      messages: messages as Chat.Message[],
      signal: thread.abortController.signal,
      options,
    })

    return { completion }
  },
)
