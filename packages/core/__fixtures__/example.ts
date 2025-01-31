/* eslint-disable unicorn/prefer-top-level-await */
import { add, createThread } from '../thread'
import { createReference } from '../utils'

async function main() {
  const thread = createThread()

  const jsonTool = add(thread, 'parse', {
    id: 'json',
    input: {
      format: 'json',
      value: '{"object": "Hello, world!"}',
    },
  })

  const inputId = add(thread, 'passthrough', {
    id: 'passthrough',
    input: {
      value: createReference('Tools', jsonTool),
    },
  })

  add(thread, 'output', {
    id: 'output',
    input: {
      name: 'Message',
      description: 'The message that was sent.',
      value: createReference('Nodes', inputId, 'value'),
    },
  })

  const result = await thread.start({ Message: 'Hello, world!' })
  console.log(result.Message)
}

main()
