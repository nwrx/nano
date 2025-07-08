import { createProvider } from './createProvider'

describe('createRequestContext', () => {
  it('createRequestContext', { timeout: 10000 }, async() => {
    const provider = createProvider('openRouter')

    const models = await provider.searchModels()
    console.log('Models:', models)

    provider.on('textGenerationEvent', (event) => {
      if (event.type === 'raw') return
      console.log('Text Generation Event:', event)
    })

    const stream = provider.generateText({
      model: 'x-ai/grok-3-beta',
      messages: [
        { role: 'system', content: 'You are a grumpy assistant.' },
        'What is the sum of 2 and 3?',
        // {
        //   role: 'user',
        //   content: [
        //     { type: 'text', text: 'Here is a file for you to analyze:' },
        //     {
        //       type: 'file',
        //       name: 'cat.png',
        //       data: new URL('https://cdn2.thecatapi.com/images/5p6.jpg'),
        //       mediaType: 'image/png',
        //     },
        //   ],
        // },
      ],
      tools: [
        {
          name: 'sum',
          description: 'Sums two numbers.',
          inputSchema: {
            type: 'object',
            required: ['a', 'b'],
            properties: {
              a: { type: 'number', description: 'The first number.' },
              b: { type: 'number', description: 'The second number.' },
            },
          },
          call: (input) => {
            const { a, b } = input
            return `The sum of ${a} and ${b} is ${a + b}.`
          },
        },
      ],
    })

    // Read the stream to ensure it works
    const reader = stream.getReader()
    const outputs: string[] = []
    while (true) {
      const result = await reader.read()
      if (result.done) break
      if (result.value) outputs.push(result.value)
    }
    reader.releaseLock()
    console.log('Outputs:', outputs.join(''))
  })
})
