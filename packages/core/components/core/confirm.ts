/* eslint-disable @typescript-eslint/no-use-before-define */
import { randomUUID } from 'node:crypto'
import { defineComponent } from '../../utils/defineComponent'

export interface EventConfirmRequest {
  id: string
  question: string
  text?: string
  timeout?: number
}

export const confirm = defineComponent(
  {
    isTrusted: true,
    title: 'Confirm',
    icon: 'https://api.iconify.design/mdi:check-circle-outline.svg',
    description: 'Ask for user confirmation and await the response. This will interrupt the flow until the user provides a response.',
    inputs: {
      question: {
        type: 'string',
        title: 'Question',
        description: 'The question to ask the user.',
        example: 'Are you sure?',
      },
      text: {
        'type': 'string',
        'title': 'Text',
        'description': 'The text to display to the user.',
        'x-optional': true,
        'x-control': 'textarea',
      },
      timeout: {
        'type': 'integer',
        'title': 'Timeout',
        'minimum': 0,
        'description': 'The timeout in milliseconds before the response is considered invalid.',
        'x-optional': true,
      },
    },
    outputs: {
      response: {
        type: 'boolean',
        title: 'Response',
        description: 'The response from the user.',
      },
    },
  },
  async({ data, thread, nodeId }) => {
    const { question, text, timeout = 60000 } = data
    const eventConfirmRequest: EventConfirmRequest = { id: randomUUID(), question, text, timeout }
    let timeoutInstance: NodeJS.Timeout

    // --- If timeout is reached, reject the promise with an error.
    return new Promise((resolve, reject) => {
      if (typeof timeout === 'number' && timeout > 0) {
        timeoutInstance = setTimeout(() => {
          stopOnAbort()
          stopOnResponse()
          const error = new Error('Timeout.')
          reject(error)
        }, timeout)
      }

      // --- If a response is received, resolve the promise with the response.
      const stopOnResponse = thread.on('nodeResponse', (thisId, event) => {
        if (thisId === nodeId && event.id === eventConfirmRequest.id) {
          if (timeoutInstance) clearTimeout(timeoutInstance)
          stopOnAbort()
          stopOnResponse()
          resolve({ response: event.response as boolean })
        }
      })

      // --- If the user cancels, reject the promise with an error.
      const stopOnAbort = thread.on('abort', () => {
        const error = new Error('Aborted by user.')
        if (timeoutInstance) clearTimeout(timeoutInstance)
        stopOnAbort()
        stopOnResponse()
        reject(error)
      })

      // --- Dispatch the event to the thread.
      thread.dispatch(
        'nodeConfirmRequest',
        nodeId,
        eventConfirmRequest,
      )
    })
  },
)
