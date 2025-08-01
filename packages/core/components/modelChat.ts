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

export const modelChat = defineComponent(
  {
    isTrusted: true,
    name: 'model-chat',
    purpose: 'processing',
    icon: 'carbon:machine-learning',
    title: {
      en: 'Inference',
      fr: 'Inférence',
      de: 'Inferenz',
      es: 'Inferencia',
      zh: '推理',
    },
    description: {
      en: 'Generate text completions using AI language models with customizable parameters and tools.',
      fr: 'Générer des complétions de texte en utilisant des modèles de langage IA avec des paramètres et outils personnalisables.',
      de: 'Textvervollständigungen mit KI-Sprachmodellen und anpassbaren Parametern und Tools generieren.',
      es: 'Generar completaciones de texto usando modelos de lenguaje de IA con parámetros y herramientas personalizables.',
      zh: '使用AI语言模型生成文本补全，支持自定义参数和工具。',
    },
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
