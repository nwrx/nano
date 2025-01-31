/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Thread } from '../../../thread'
import { randomUUID } from 'node:crypto'
import { createEventMetadata } from '../../../utils/createEventMetadata'

export type QuestionChoiceValue = boolean | number | string

export interface QuestionOptions {
  question: string
  text?: string
  timeout?: number
  defaultValue?: QuestionChoiceValue
  choices?: Array<{
    value: QuestionChoiceValue
    label: string
    description?: string
    icon?: string
    imageUrl?: string
  }>
}

export interface EventQuestion extends QuestionOptions {
  id: string
}

export async function askQuestion(thread: Thread, nodeId: string, options: QuestionOptions): Promise<QuestionChoiceValue> {
  const { question, text, defaultValue, timeout = 60000, choices } = options
  const eventQuestion: EventQuestion = { id: randomUUID(), question, text, timeout, choices, defaultValue }

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
    const stopOnCancel = thread.on('nodeQuestionCancel', (id, eventId) => {
      if (id === nodeId && eventId === eventQuestion.id) {
        stopOnAbort()
        stopOnCancel()
        stopOnResponse()
        const error = new Error('Canceled by user.')
        reject(error)
      }
    })
    const stopOnResponse = thread.on('nodeResponse', (id, event) => {
      if (id === nodeId && event.id === eventQuestion.id) {
        stopOnAbort()
        stopOnCancel()
        stopOnResponse()
        if (timeoutInstance) clearTimeout(timeoutInstance)
        resolve(event.response)
      }
    })
    const stopOnAbort = thread.on('abort', () => {
      stopOnAbort()
      stopOnCancel()
      stopOnResponse()
      if (timeoutInstance) clearTimeout(timeoutInstance)
      const error = new Error('Aborted by user.')
      reject(error)
    })
    thread.dispatch(
      'nodeQuestionRequest',
      nodeId,
      eventQuestion,
      createEventMetadata(thread, nodeId),
    )
  })
}
