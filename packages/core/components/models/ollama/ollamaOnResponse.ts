
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