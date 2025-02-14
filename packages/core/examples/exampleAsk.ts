/* eslint-disable unicorn/prefer-top-level-await */
import { dedent } from '@unshared/string'
import { consola } from 'consola'
import { createThreadFromFlow } from '../thread'
import { start } from '../thread'

async function main() {
  const thread = createThreadFromFlow({
    version: '1',
    nodes: {
      ask: {
        component: 'ask',
        timeout: 30000,
      },
      openai: {
        component: 'openai',
        token: process.env.OPENAI_API_KEY,
        modelId: 'gpt-3.5-turbo',
      },
      // groq: {
      //   component: 'groq',
      //   model: 'llama3-8b-8192',
      //   token: process.env.GROQ_API_KEY,
      // },
      // mistralai: {
      //   component: 'mistralai',
      //   model: 'mistral-large-latest',
      //   token: process.env.MISTRALAI_API_KEY,
      // },
      execute: {
        component: 'execute',
      },
      anthropic: {
        component: 'anthropic',
        model: 'claude-3-5-sonnet-20241022',
        token: process.env.ANTHROPIC_API_KEY,
      },
      inference: {
        component: 'inference',
        model: { $ref: '#/Nodes/openai/model' },
        tools: [
          { $ref: '#/Nodes/execute' },
          { $ref: '#/Nodes/ask' },
        ],
        messages: [
          {
            role: 'system',
            content: dedent(`
              At first, allow the user to ask a free-form question with the 'ask' tool.
              - If you need help or more information, feel free to ask.
              - You have access to the 'execute' tool to run shell commands.
              - Only end the conversation when the user explicitly asks to end it.

              When executing a command
              - Give a preview of the command before running it. Example: 'ls -l'
              - If possible, provide arguments and options for the command that minimize the output.
              - For any dangerous or destructive commands, please confirm with me first.

              Very important, when completing the task, always ask for another question
              - Preferably in the same context as the previous question.
              - And by subsequently prompting the user with the 'ask' tool.

              Example:
              - Assistant: "Hello, what can I help you with today?"
              - User: "Can you show me the contents of the current directory and their respective permissions?"
              - Assistant: "Sure, I will run 'ls -l' to show the contents of the current directory."
              - Assistant: "<Call 'execute' tool with { executable: 'ls', parameters: ['-l'] }>"
              - Assistant: "Here are the contents of the current directory. ..."
            `),
          },
          {
            role: 'user',
            content: '<Start/>',
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

  thread.on('nodeOutput', async(_, name, value) => {
    if (name === 'completion') {
      const stream = value as ReadableStream<string>
      const reader = stream.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) { process.stdout.write('\n'); break }
        if (value) process.stdout.write(value)
      }
    }
  })

  thread.on('nodeQuestionRequest', async(nodeId, event) => {
    const response = event.choices && event.choices.length > 0
      ? await consola.prompt(event.question, {
        type: 'select',
        initial: String(event.choices[0].value),
        options: event.choices.map(choice => ({
          label: choice.label,
          value: String(choice.value),
          hint: choice.description,
        })),
      })
      : await consola.prompt(event.question, {
        type: 'text',
        initial: typeof event.defaultValue === 'string' ? event.defaultValue : undefined,
      })
    thread.dispatch('nodeResponse', nodeId, { id: event.id, response })
  })

  thread.on('nodeConfirmRequest', (nodeId, event) => {
    process.nextTick(async() => {
      const response = await consola.prompt(event.question, { type: 'confirm' })
      thread.dispatch('nodeResponse', nodeId, { id: event.id, response })
    }, 1000)
  })

  thread.on('nodeToolRequest', async(nodeId, event) => {
    console.log(event)
  })
  thread.on('nodeToolResponse', async(nodeId, event) => {
    console.log(event)
  })

  thread.on('nodeError', (_, error) => {
    consola.error(error.name, '\n\n', error.message)
  })

  const output = await start(thread, { Message: 'Hello, world!' })
  consola.info('The completion is done.', output)
}

void main()
