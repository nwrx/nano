/* eslint-disable unicorn/prefer-top-level-await */
import { consola } from 'consola'
import { createThreadFromFlow } from '../thread'
import { start } from '../thread'

async function main() {
  const thread = createThreadFromFlow({
    version: '1',
    nodes: {
      input: {
        component: 'input',
        name: 'Message',
      },
      anthropic: {
        component: 'anthropic',
        model: 'claude-3-haiku-20240307',
        token: process.env.ANTHROPIC_API_KEY,
      },
      mcp: {
        component: 'mcp',
        endpoint: 'http://localhost:8080/kubernetes/sse',
      },
      inference: {
        component: 'inference',
        model: { $ref: '#/Nodes/anthropic/model' },
        tools: [
          { $ref: '#/Nodes/mcp/tools' },
        ],
        messages: [
          {
            role: 'user',
            content: { $ref: '#/Nodes/input/value' },
          },
        ],
        parameters: {
          stream: true,
          maxCompletionTokens: 1024,
          allowParallelToolCalls: true,
        },
      },
      outputCompletion: {
        component: 'output',
        name: 'completion',
        description: 'The message that was sent.',
        value: { $ref: '#/Nodes/inference/completion' },
      },
    },
  })

  // thread.on('nodeOutput', async(_, name, value) => {
  //   if (name === 'completion') {
  //     const stream = value as ReadableStream<string>
  //     const reader = stream.getReader()
  //     while (true) {
  //       const { done, value } = await reader.read()
  //       if (done) { process.stdout.write('\n'); break }
  //       if (value) process.stdout.write(value)
  //     }
  //   }
  // })

  // thread.on('nodeQuestionRequest', async(nodeId, event) => {
  //   const response = event.choices && event.choices.length > 0
  //     ? await consola.prompt(event.question, {
  //       type: 'select',
  //       initial: String(event.choices[0].value),
  //       options: event.choices.map(choice => ({
  //         label: choice.label,
  //         value: String(choice.value),
  //         hint: choice.description,
  //       })),
  //     })
  //     : await consola.prompt(event.question, {
  //       type: 'text',
  //       initial: typeof event.defaultValue === 'string' ? event.defaultValue : undefined,
  //     })
  //   thread.dispatch('nodeResponse', nodeId, { id: event.id, response })
  // })

  // thread.on('nodeConfirmRequest', (nodeId, event) => {
  //   process.nextTick(async() => {
  //     const response = await consola.prompt(event.question, { type: 'confirm' })
  //     thread.dispatch('nodeResponse', nodeId, { id: event.id, response })
  //   }, 1000)
  // })

  thread.on('nodeToolRequest', (nodeId, event) => {
    consola.log(event)
  })
  thread.on('nodeToolResponse', (nodeId, event) => {
    consola.log(event)
  })

  thread.on('nodeError', (_, error) => {
    consola.error(error.name, '\n\n', error.message, '\n\n', error.stack)
  })

  // thread.on('nodeDone', (nodeId, data) => {
  //   console.log(`Node ${nodeId}:`, data)
  // })

  thread.on('nodeOutputDeltaStart', (_, name) => { consola.info(`Output delta started for ${name}.`) })
  thread.on('nodeOutputDelta', (_, name, value) => { process.stdout.write(value) })
  thread.on('nodeOutputDeltaEnd', () => { process.stdout.write('\n') })

  // consola.info('The completion is done.', output)
  await start(thread, { Message: process.argv.slice(2).join(' ') })
}

void main()
