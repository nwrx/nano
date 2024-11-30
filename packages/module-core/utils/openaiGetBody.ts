import type { InferenceData } from '../nodes'
import type { OpenaiChatRequest } from './openai'

/**
 * Given the input data of the `core/inference` node, this function returns the body of
 * the request to the OpenAI API. Since a lot of LLM providers have similar APIs, this
 * function can be reused with minor modifications for other providers.
 *
 * @param data The input data of the `core/inference` node.
 * @returns The body of the request to the OpenAI API.
 * @example
 * // An example input data object.
 * const data = {
 *   model: { model: 'gpt-3.5-turbo', token: '...' },
 *   prompt: 'Hello, my name is',
 *   seed: 0.5,
 *   temperature: 0.7,
 *   maxCompletionTokens: 100,
 * }
 *
 * // The body of the request to the OpenAI API.
 * openaiGetBody(data)
 * // => {
 * //   model: 'gpt-3.5-turbo',
 * //   messages: [{ role: 'user', content: 'Hello, my name is' }],
 * //   seed: 0.5,
 * //   temperature: 0.7,
 * //   max_completion_tokens: 100,
 * // }
 */
export function openaiGetBody(data: InferenceData): OpenaiChatRequest {
  const {
    model,
    prompt,
    seed,
    temperature,
    maxCompletionTokens,
    tools = [],
  } = data

  const toolsBody = tools.map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.schema,
      strict: false,
    },
  } as const))

  return {
    model: model.model,
    messages: [{ role: 'user', content: prompt }],
    seed: seed === 0 ? undefined : seed,
    temperature,
    max_completion_tokens: maxCompletionTokens,
    tools: toolsBody.length > 0 ? toolsBody : undefined,
  }
}
