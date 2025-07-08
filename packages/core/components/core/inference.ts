import { createProvider } from '../../inference/createProvider'
import { defineComponent, TOOL_SCHEMA } from '../../utils'

export const inference = defineComponent(
  {
    isTrusted: true,
    inputs: {
      provider: {
        title: 'Provider',
        description: 'The provider to use for inference.',
        type: 'string',
      },
      model: {
        title: 'Model',
        description: 'The language model used to generate the completion.',
        type: 'string',
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
        oneOf: [
          {
            type: 'array',
            items: {
              oneOf: [
                { type: 'object', additionalProperties: true },
                { type: 'string' },
              ],
            },
          },
          { type: 'string' },
          { type: 'object', additionalProperties: true },
        ],
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
  ({ data, thread }) => {
    const provider = createProvider(data.provider, data.options)
    const completion = provider.generateText({
      model: data.model,
      messages: data.messages,
      tools: data.tools,
      abortSignal: thread.abortController.signal,
    })
    return { completion }
  },
)
