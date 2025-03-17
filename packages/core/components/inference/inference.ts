import type { LanguageModelMessage, LanguageModelRequestContext } from './utils'
import { defineComponent } from '../../utils/defineComponent'
import { toolSchema } from '../../utils/toolSchema'
import {
  handleResponseContent,
  handleResponseMessageDelta,
  handleResponseMessages,
  languageModelMessageSchema,
  languageModelParametersSchema,
  languageModelSchema,
} from './utils'

function normalizeMessage(message: LanguageModelMessage | string): LanguageModelMessage {
  return typeof message === 'string'
    ? { role: 'user', content: message }
    : message
}

export const inference = defineComponent(
  {
    isTrusted: true,
    inputs: {
      model: {
        title: 'Model',
        description: 'The language model used to generate the completion.',
        ...languageModelSchema,
      },
      tools: {
        title: 'Tools',
        description: 'The tools used to generate the completion.',
        default: [],
        type: 'array',
        items: toolSchema,
      },
      messages: {
        title: 'Messages',
        description: 'The message to generate a completion for.',
        default: [],
        oneOf: [
          {
            type: 'array',
            items: {
              oneOf: [
                languageModelMessageSchema,
                { type: 'string' },
              ],
            },
          },
          { type: 'string' },
          languageModelMessageSchema,
        ],
      },
      parameters: {
        'title': 'Parameters',
        'description': 'The parameters used by the language model to generate the completion. Each LLM provides a different set of parameters that can be used to customize the inference process.',
        'default': {},
        'x-control': 'table',
        ...languageModelParametersSchema,
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
  ({ data, thread, nodeId }) => {
    const { model, tools, messages, parameters } = data

    // --- Create shared context between the API calls. This allows the `onRequest` and
    // --- `onResponse` functions to mutate the model and interact with the context.
    const context: LanguageModelRequestContext = {
      url: model.url,
      model: model.model,
      method: 'POST',
      body: {},
      headers: new Headers(),
      thread,
      nodeId,
      parameters,
      tools: Array.isArray(tools) ? tools : [tools],
      messages: Array.isArray(messages)
        ? messages.map(x => normalizeMessage(x))
        : [normalizeMessage(messages)],
    }

    return {
      completion: new ReadableStream<string>({
        async start(controller) {
          let isDone = false
          try {
            while (true) {
              await model.onRequest(context)
              const response = await fetch(context.url, {
                method: context.method,
                body: JSON.stringify(context.body),
                headers: context.headers,
                signal: thread.abortController.signal,
              })

              isDone = true
              await model.onResponse({
                response,
                resume: () => isDone = false,
                pushContent: content => handleResponseContent(controller, content),
                pushMessages: (...messages) => handleResponseMessages(context, ...messages),
                pushMessageDelta: message => handleResponseMessageDelta(context, message),
              })
              if (isDone) break
            }

            if (isDone) return controller.close()
            const error = new Error('The inference process was interrupted.')
            controller.error(error)
          }
          catch (error) {
            controller.error(error)
          }
        },
      }),
    }
  },
)
