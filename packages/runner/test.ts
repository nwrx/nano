/* eslint-disable unicorn/prefer-top-level-await */
import type { ModuleRunner } from './application'
import type { ThreadWorkerMessage } from './worker'
import { createClient } from '@unserved/client'

async function main() {
  let once = false
  let id: string | undefined

  const client = createClient<ModuleRunner>({ baseUrl: 'http://localhost:3010' })
  const socket = await client.connect('WS /thread', {
    autoReconnect: true,
    reconnectDelay: 1000,
    reconnectLimit: 10,
    initialPayload: {
      event: 'create',
      data: {
        version: '1',
        nodes: {
          openai: {
            component: 'openai',
            token: process.env.OPENAI_API_KEY,
            modelId: 'gpt-3.5-turbo',
          },
          inference: {
            component: 'inference',
            model: { $ref: '#/Nodes/openai/model' },
            messages: 'Give me a recipe for a cake.',
            parameters: {
              stream: true,
            },
          },
          output: {
            component: 'output',
            name: 'completion',
            description: 'The message that was sent.',
            value: { $ref: '#/Nodes/inference/completion' },
          },
        },
      },
    },
    async onMessage(message: ThreadWorkerMessage) {
      if (!once) {
        once = true
        setTimeout(() => {
          socket.send({ event: 'start', data: {} })
        })
      }

      if (message.event === 'worker:ready')
        id = message.data[0]

      if (message.event === 'done') {
        const [output] = message.data

        for (const name in output) {
          const data = await client.request('GET /thread/:id/:name', { parameters: { id, name } })
          const stream = data as ReadableStream<Uint8Array>
          const reader = stream.getReader()
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const text = new TextDecoder().decode(value)
            process.stdout.write(text)
          }
        }
      }
    },
    onOpen: () => {
      once = false
    },
  })
}

void main()
