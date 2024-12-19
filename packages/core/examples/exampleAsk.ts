/* eslint-disable unicorn/prefer-top-level-await */
import { consola } from 'consola'
import { createThreadFromFlow, sendResponse } from '../thread'
import { start } from '../thread'

async function main() {
  const thread = createThreadFromFlow({
    version: '1',
    nodes: {
      parse: {
        component: 'parse',
        format: 'json',
        value: '{"object": "Hello, world!"}',
      },
      ask: {
        component: 'ask',
        question: 'What format would you like to use?',
        timeout: 10000,
        choices: [
          { value: 'json', label: 'JSON', description: 'JavaScript Object Notation' },
          { value: 'yaml', label: 'YAML', description: 'YAML Ain\'t Markup Language' },
        ],
      },
      stringify: {
        component: 'stringify',
        format: { $ref: '#/Nodes/ask/response' },
        object: { $ref: '#/Nodes/parse/object' },
      },
      output: {
        component: 'output',
        name: 'Response',
        description: 'The message that was sent.',
        value: { $ref: '#/Nodes/stringify/value' },
      },
    },
  })

  thread.on('nodeDone', (id) => {
    consola.ready(`[${id}] Done.`)
  })

  thread.on('nodeQuestionRequest', async(nodeId, event) => {
    const response = await consola.prompt(event.question, {
      type: 'select',
      initial: String(event.choices![0].value as string),
      options: event.choices!.map(choice => ({
        label: choice.label,
        value: choice.value as string,
        hint: choice.description,
      })),
    })
    sendResponse(thread, nodeId, event.id, response)
  })

  await start(thread, { Message: 'Hello, world!' })
    .then(output => consola.box(output))
    .catch(error => consola.error(error))
}

void main()
