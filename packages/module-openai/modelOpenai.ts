import type { NodeInstanceContext, SocketListOption } from '@nwrx/core'
import type { OpenaiChatRequest } from './OpenaiChatRequest'
import type { OpenaiChatResponse } from './OpenaiChatResponse'
import type { OpenaiModelResponse } from './OpenaiModelResponse'
import { defineDataSchema, defineNode } from '@nwrx/core'
import { categoryLanguageModel, createLanguageModel, languageModel, string } from '@nwrx/module-core'

/** The base URL for the OpenAI API. */
const OPENAI_BASE_URL = 'https://api.openai.com/v1'

export const modelOpenai = defineNode({
  kind: 'openai-api',
  name: 'OpenAI API',
  icon: 'https://api.iconify.design/simple-icons:openai.svg',
  description: 'The **OpenAI API** node is designed to retreive a **Language Model Instance** that can be used to generate completions using the OpenAI API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',
  category: categoryLanguageModel,

  // --- Define the inputs of the node.
  dataSchema: async({ data, abortSignal }: NodeInstanceContext) => {
    const dataSchema = defineDataSchema({
      token: {
        name: 'API Key',
        type: string,
        control: 'variable',
        description: 'The API key for the OpenAI API.',
      },
      model: {
        type: string,
        control: 'select',
        name: 'Model Name',
        description: 'The name of the model to use for generating completions.',
        options: [] as Array<SocketListOption<string>>,
      },
    })

    // --- Attempt to fill the model names from the API.
    try {
      const { token = '' } = data as Record<string, string>
      const url = new URL('/v1/models', OPENAI_BASE_URL)
      const response = await fetch(url.href, { signal: abortSignal, headers: { Authorization: `Bearer ${token}` } })
      const models = await response.json() as OpenaiModelResponse
      dataSchema.model.options = models.data.filter(x => x.object === 'model').map(x => ({
        value: x.id,
        label: x.id,
        description: x.owned_by,
        icon: 'https://api.iconify.design/simple-icons:openai.svg',
      }))
    }
    catch { /* Ignore errors */ }

    // --- Return the data schema.
    return dataSchema
  },

  // --- Define the outputs of the node.
  resultSchema: {
    model: {
      name: 'Model',
      type: languageModel,
      description: 'The model information to use for generating completions.',
    },
  },

  // --- On processing the node, check the API key and model name
  // --- are valid and return the model information.
  process: ({ data }) => ({
    model: createLanguageModel<OpenaiChatRequest, OpenaiChatResponse>({
      url: new URL('/v1/chat/completions', OPENAI_BASE_URL).href,
      model: data.model,
      token: data.token,

      getBody: (options): OpenaiChatRequest => ({
        model: data.model,
        messages: [{ role: 'user', content: options.prompt }],
        seed: options.seed,
        temperature: options.temperature,
        max_completion_tokens: options.maxCompletionTokens,
        tools: (options.tools && options.tools.length > 0)
          ? options.tools.map(tool => ({
            type: 'function',
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.schema,
              strict: false,
            },
          }))
          : undefined,
      }),

      /**
       * Handle the data returned by the model API. This function is called
       * when the model API returns a response to the completion request.
       * The function can handle the completion data, tool calls, and stop
       * the completion process.
       *
       * @param context The context object that contains the data returned by the model API.
       * @param context.body The body of the request sent to the model API.
       * @param context.data The data returned by the model API.
       * @param context.call The function to call a tool that was requested by the model.
       * @param context.resume The function to resume the completion process.
       * @returns The completion data if the completion is stopped, otherwise undefined.
       */
      onData: async({ body, data, call, resume }) => {
        const { choices: [choice], id, usage } = data

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
      },

      /**
       * When an API error occurs, this function is called to handle the error
       * and return the user-friendly error message comming from the API.
       *
       * @param response The response object from the API.
       * @returns The user-friendly error message.
       */
      onError: async(response) => {
        try {
          const data = await response.json() as { error: { message: string } }
          return `The OpenAI API returned an error: ${data.error.message}`
        }
        catch {
          return `The OpenAI API returned an error: ${response.statusText}`
        }
      },
    }),
  }),
})
