/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { randomUUID } from 'node:crypto'
import { defineComponent } from '../utils/defineComponent'

export interface EventConfirmRequest {
  id: string
  title: string
  text?: string
  timeout?: number
}

export interface EventConfirmResponse {
  id: string
  response: boolean
}

export type EventMapConfirm = {
  'nodeConfirmResponse': [nodeId: string, event: EventConfirmResponse]
  'nodeConfirmRequest': [nodeId: string, event: EventConfirmRequest]
  'nodeConfirmCancel': [nodeId: string, confirmId: string]
}

export const confirm = defineComponent(
  {
    isTrusted: true,
    name: 'confirm',
    purpose: 'control',
    icon: 'carbon:checkmark-outline',
    title: {
      en: 'Confirm',
      fr: 'Confirmer',
      de: 'Bestätigen',
      es: 'Confirmar',
      zh: '确认',
    },
    description: {
      en: 'Ask the user for confirmation.',
      fr: 'Demander une confirmation à l’utilisateur.',
      de: 'Fragt den Benutzer um Bestätigung.',
      es: 'Pide confirmación al usuario.',
      zh: '向用户请求确认。',
    },
    inputs: {
      title: {
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
    const { title: question, text, timeout = 60000 } = data
    const eventConfirmRequest: EventConfirmRequest = { id: randomUUID(), title: question, text, timeout }
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
      const stopOnResponse = thread.on('nodeConfirmResponse', (thisId, event) => {
        if (thisId === nodeId && event.id === eventConfirmRequest.id) {
          if (timeoutInstance) clearTimeout(timeoutInstance)
          stopOnAbort()
          stopOnCancel()
          stopOnResponse()
          resolve({ response: event.response })
        }
      })

      // --- If the confirm request was canceled, reject the promise with an error.
      const stopOnCancel = thread.on('nodeConfirmCancel', (thisId, confirmId) => {
        if (thisId === nodeId && confirmId === eventConfirmRequest.id) {
          if (timeoutInstance) clearTimeout(timeoutInstance)
          stopOnAbort()
          stopOnCancel()
          stopOnResponse()
          const error = new Error('Canceled by user.')
          reject(error)
        }
      })

      // --- If the thread is aborted, reject the promise with an error.
      const stopOnAbort = thread.on('abort', () => {
        const error = new Error('Aborted by user.')
        if (timeoutInstance) clearTimeout(timeoutInstance)
        stopOnAbort()
        stopOnCancel()
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
