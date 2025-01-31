import type { LanguageModelOnDataContext } from '../types'
import type { OllamaChatRequest, OllamaChatResponse, OllamaModel } from '../utils'
import type { InferenceData, InferenceResult } from './nodeInference'
import { defineLanguageModel } from '../utils'

export const nodeModelOllama = defineLanguageModel({
  name: 'Ollama',
  kind: 'core/ollama',
  icon: 'https://api.iconify.design/simple-icons:ollama.svg',
  description: 'The **Ollama API** node is designed to retrieve a **Language Model Instance** that can be used to generate completions using the Ollama API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',

  // --- API-specific properties.
  defaultUrl: 'http://localhost:11434',
  defaultModel: 'default-model',
  pathModels: '/api/tags',
  pathCompletions: '/api/chat',
  allowCustomUrl: true,
  allowCustomModel: true,

  // --- Compute the body of the request.
  getBody: (data: InferenceData): OllamaChatRequest => ({
    stream: false,
    model: data.model.model,
    messages: [{
      role: 'user',
      content: data.prompt,
    }],
    tools: data.tools?.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.schema,
      },
    })),
    options: {
      n: 1,
      seed: data.seed,
      temperature: data.temperature,
      max_tokens: data.maxCompletionTokens,
    },
  }),

  // --- Fetch the models available for the API.
  getModels: async({ path, baseUrl, token, query }) => {
    const url = new URL(path, baseUrl)
    const response = await fetch(url.href, { headers: { Authorization: `Bearer ${token}` } })
    const models = await response.json() as { models: OllamaModel[] }
    return models.models
      .filter((model) => {
        if (!query) return true
        return model.name.toLowerCase().includes(query.toLowerCase())
      })
      .map(model => ({
        value: model.name,
        label: model.name,
        description: `Size: ${model.details.parameter_size} | Quantization: ${model.details.quantization_level}`,
        icon: 'https://api.iconify.design/simple-icons:ollama.svg',
      }))
  },

  onData: async(context: LanguageModelOnDataContext<OllamaChatRequest, OllamaChatResponse>): Promise<InferenceResult | void> => {
    const { body, data, call, resume } = context
    const { message, done_reason, created_at } = data

    // --- Handle tool calls returned by the model.
    if (message.tool_calls && message.tool_calls.length > 0) {
      if (message.role !== 'assistant') throw new Error('Expected the tool calls to originate from the assistant.')
      const toolResultPromises = message.tool_calls.map(async(toolCall) => {
        const name = toolCall.function.name
        const parameters = toolCall.function.arguments as Record<string, unknown>
        const result = await call(name, parameters)
        body.messages.push(message, {
          role: 'tool',
          content: JSON.stringify(result),
        })
      })
      await Promise.all(toolResultPromises)
      return resume()
    }

    // --- Stop the completion.
    if (done_reason === 'stop') {
      if (message.role !== 'assistant') throw new Error('The assistant message was not provided.')
      const completion = Array.isArray(message.content) ? message.content.join('\n') : message.content
      return {
        id: created_at,
        completion,
      }
    }
  },
})
