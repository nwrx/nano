/* eslint-disable @typescript-eslint/no-use-before-define */
import { randomUUID } from 'node:crypto'
import { defineComponent } from '../../utils/defineComponent'

export type QuestionChoiceValue = boolean | number | string

export interface QuestionChoice {
  value: QuestionChoiceValue
  label: string
  description?: string
  icon?: string
  imageUrl?: string
}

export interface EventQuestion {
  id: string
  question: string
  text?: string
  timeout?: number
  defaultValue?: QuestionChoiceValue
  choices?: QuestionChoice[]
}

export interface EventResponse {
  id: string
  response: QuestionChoiceValue
}

export const ask = defineComponent(
  {
    isTrusted: true,
    inputs: {
      question: {
        type: 'string',
        title: 'Question',
        description: 'The question to ask the user.',
        example: 'What is your name?',
      },
      text: {
        'type': 'string',
        'title': 'Text',
        'description': 'The text to display to the user.',
        'x-optional': true,
        'x-control': 'textarea',
      },
      choices: {
        'type': 'array',
        'title': 'If provided, the response must be one of the following choices.',
        'description': 'The choices for the response.',
        'x-optional': true,
        'items': {
          type: 'object',
          required: ['value', 'label'],
          additionalProperties: false,
          properties: {
            value: {
              title: 'Value',
              description: 'The value of the choice.',
              oneOf: [
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' },
              ],
            },
            label: {
              type: 'string',
              title: 'Label',
              description: 'The label for the choice.',
            },
            description: {
              type: 'string',
              title: 'Description',
              description: 'A description of the choice.',
            },
            icon: {
              type: 'string',
              title: 'Icon',
              description: 'The icon for the choice.',
            },
            imageUrl: {
              type: 'string',
              title: 'Image URL',
              description: 'The image URL for the choice.',
            },
          },
        },
      },
      defaultValue: {
        'title': 'Default Value',
        'description': 'The default value for the response.',
        'x-optional': true,
        'oneOf': [
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
        ],
      },
      timeout: {
        'type': 'integer',
        'title': 'Timeout',
        'minimum': 0,
        'description': 'The timeout in milliseconds before the response is considered invalid. Note that since it is in milliseconds, a value of 10000 is equivalent to 10 seconds.',
        'x-optional': true,
      },
    },
    outputs: {
      response: {
        title: 'Response',
        description: 'The response from the user.',
        oneOf: [
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
        ],
      },
    },
  },
  async({ data, thread, nodeId }) => {
    const { question, text, defaultValue, timeout, choices } = data
    const eventQuestion: EventQuestion = { id: randomUUID(), question, text, timeout, choices, defaultValue }

    // --- If timeout is reached, reject the promise with an error.
    return new Promise((resolve, reject) => {
      let timeoutInstance: NodeJS.Timeout
      if (typeof timeout === 'number' && timeout > 0) {
        timeoutInstance = setTimeout(() => {
          stopOnAbort()
          stopOnCancel()
          stopOnResponse()
          const error = new Error('Timeout.')
          reject(error)
        }, timeout)
      }

      // --- If the question was canceled, reject the promise with an error.
      const stopOnCancel = thread.on('nodeQuestionCancel', (id, eventId) => {
        if (id === nodeId && eventId === eventQuestion.id) {
          stopOnAbort()
          stopOnCancel()
          stopOnResponse()
          const error = new Error('Canceled by user.')
          reject(error)
        }
      })

      // --- If a response is received, resolve the promise with the response.
      const stopOnResponse = thread.on('nodeResponse', (id, event) => {
        if (id === nodeId && event.id === eventQuestion.id) {
          stopOnAbort()
          stopOnCancel()
          stopOnResponse()
          if (timeoutInstance) clearTimeout(timeoutInstance)
          resolve({ response: event.response })
        }
      })

      // --- If the user aborts the thread, reject the promise with an error.
      const stopOnAbort = thread.on('abort', () => {
        stopOnAbort()
        stopOnCancel()
        stopOnResponse()
        if (timeoutInstance) clearTimeout(timeoutInstance)
        const error = new Error('Aborted by user.')
        reject(error)
      })

      // --- Dispatch the question to the thread.
      thread.dispatch(
        'nodeQuestionRequest',
        nodeId,
        eventQuestion,
      )
    })
  },
)
