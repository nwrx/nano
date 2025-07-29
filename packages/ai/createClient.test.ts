/* eslint-disable sonarjs/no-commented-code */
import { createClient } from './createClient'

describe('createRequestContext', () => {
  it('createRequestContext', { timeout: 100000 }, async() => {
    const provider = createClient('openai', {})

    provider.on('request', (id, context) => {
      console.log({
        url: context.url.toString(),
        body: context.init.body,
        headers: context.init.headers,
      })
    })

    const models = await provider.searchModels()
    const data = models.models.map(model => ({
      name: model.name,
      features: model.features,
      pricing: model.pricing,
    }))
    console.log(JSON.stringify(data, null, 2))

    const result = await provider.createSpeech({
      model: 'gpt-4o-mini-tts',
      input: 'Hello, this is a test of the text-to-speech functionality.',
      options: {
        speed: 1,
        voice: 'ash',
        instructions: 'Please read this text aloud with a friendly tone.',
        streamFormat: 'sse',
        responseFormat: 'wav',
      },
    })

    // Example usage for embeddings (commented out for now)
    // const embeddingsResult = await provider.generateEmbeddings({
    //   model: 'text-embedding-3-small',
    //   input: ['Hello world', 'This is a test'],
    //   options: {
    //     dimensions: 512,
    //     encodingFormat: 'float',
    //   },
    // })
    // console.log('Embeddings Result:', embeddingsResult.data.length, 'embeddings generated')

    // Example usage for speech (commented out for now)
    // const ttsResult = await provider.generateSpeech({
    //   model: 'tts-1',
    //   input: 'Hello, this is a test of the text-to-speech functionality.',
    //   options: {
    //     voice: 'alloy',
    //     responseFormat: 'mp3',
    //     speed: 1.0,
    //   },
    // })
    // console.log('TTS Result:', ttsResult[0]?.type, ttsResult[0]?.mediaType)

    // Example usage for transcript (commented out for now)
    // const sttResult = await provider.generateSpeechToText({
    //   model: 'whisper-1',
    //   file: new File([new Uint8Array()], 'test.wav', { type: 'audio/wav' }),
    //   options: {
    //     language: 'en',
    //     responseFormat: 'json',
    //     temperature: 0,
    //   },
    // })
    // console.log('STT Result:', sttResult[0]?.type, sttResult[0]?.text)
    // const result = await provider.generateImage({
    //   model: 'dall-e-2',
    //   prompt: 'A futuristic city skyline at sunset, with flying cars and neon lights.',
    //   options: {
    //     n: 1,
    //     size: '1024x1024',
    //     responseFormat: 'b64_json', // Use base64 format for the image
    //     // quality: 'low', // Optional: Set quality to low for faster generation
    //   },
    // })

    // vi.unmock('node:fs/promises')
    // for (const image of result) {
    //   // Write file to disk
    //   const fileName = `image-${Date.now()}.${image.mediaType.split('/')[1]}`
    //   const filePath = `./${fileName}`
    //   const fs = await import('node:fs/promises')
    //   if (image.type === 'base64') {
    //     const buffer = Buffer.from(image.data, 'base64')
    //     await fs.writeFile(filePath, buffer)
    //     console.log(`Image saved to ${filePath} (${image.mediaType})`)
    //   }
    // }

    // const stream = provider.generateText({
    //   model: 'x-ai/grok-3-beta',
    //   messages: [
    //     { role: 'system', content: 'You are a grumpy assistant.' },
    //     'What is the sum of 2 and 3?',
    //     // {
    //     //   role: 'user',
    //     //   content: [
    //     //     { type: 'text', text: 'Here is a file for you to analyze:' },
    //     //     {
    //     //       type: 'file',
    //     //       name: 'cat.png',
    //     //       data: new URL('https://cdn2.thecatapi.com/images/5p6.jpg'),
    //     //       mediaType: 'image/png',
    //     //     },
    //     //   ],
    //     // },
    //   ],
    //   tools: [
    //     {
    //       name: 'sum',
    //       description: 'Sums two numbers.',
    //       inputSchema: {
    //         type: 'object',
    //         required: ['a', 'b'],
    //         properties: {
    //           a: { type: 'number', description: 'The first number.' },
    //           b: { type: 'number', description: 'The second number.' },
    //         },
    //       },
    //       call: (input) => {
    //         const { a, b } = input
    //         return `The sum of ${a} and ${b} is ${a + b}.`
    //       },
    //     },
    //   ],
    // })

    // // Read the stream to ensure it works
    // const reader = stream.getReader()
    // const outputs: string[] = []
    // while (true) {
    //   const result = await reader.read()
    //   if (result.done) break
    //   if (result.value) outputs.push(result.value)
    // }
    // reader.releaseLock()
    // console.log('Outputs:', outputs.join(''))
  })
})
