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