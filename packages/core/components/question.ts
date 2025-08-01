/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { randomUUID } from 'node:crypto'
import { defineComponent } from '../utils/defineComponent'

export type QuestionAnswer = boolean | number | string

export interface QuestionChoice {
  value: QuestionAnswer
  label: string
  description?: string
  icon?: string
  imageUrl?: string
}

export interface EventQuestionRequest {
  id: string
  title: string
  text?: string
  timeout?: number
  defaultValue?: QuestionAnswer
  choices?: QuestionChoice[]
}

export interface EventQuestionResponse {
  id: string
  answer: QuestionAnswer
}

export type EventMapQuestion = {
  'nodeQuestionResponse': [nodeId: string, event: EventQuestionResponse]
  'nodeQuestionRequest': [nodeId: string, event: EventQuestionRequest]
  'nodeQuestionCancel': [nodeId: string, questionId: string]
}

export const question = defineComponent(
  {
    isTrusted: true,
    name: 'question',
    purpose: 'control',
    icon: 'carbon:help',
    title: {
      en: 'Question',
      fr: 'Question',
      de: 'Frage',
      es: 'Pregunta',
      zh: '问题',
    },
    description: {
      en: 'Ask users questions with customizable choices and timeout settings.',
      fr: 'Poser des questions aux utilisateurs avec des choix personnalisables et des paramètres de délai.',
      de: 'Benutzern Fragen mit anpassbaren Auswahlmöglichkeiten und Timeout-Einstellungen stellen.',
      es: 'Hacer preguntas a los usuarios con opciones personalizables y configuraciones de tiempo límite.',
      zh: '向用户提问，支持可自定义的选择和超时设置。',
    },
    inputs: {
      title: {
        'type': 'string',
        'title': 'Question',
        'description': 'The question to ask the user.',
        'example': 'What is your name?',
        'x-control': 'text',
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
        'title': 'Choices',
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
      answer: {
        title: 'Answer',
        description: 'The answer from the user.',
        oneOf: [
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
        ],
      },
    },
  },
  async({ data, thread, nodeId }) => {
    const { title: question, text, defaultValue, timeout, choices } = data
    const eventQuestion: EventQuestionRequest = { id: randomUUID(), title: question, text, timeout, choices, defaultValue }

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
      const stopOnResponse = thread.on('nodeQuestionResponse', (id, event) => {
        if (id === nodeId && event.id === eventQuestion.id) {
          stopOnAbort()
          stopOnCancel()
          stopOnResponse()
          if (timeoutInstance) clearTimeout(timeoutInstance)
          resolve({ answer: event.answer })
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
