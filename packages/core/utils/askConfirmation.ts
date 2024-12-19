/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Thread } from '../thread'
import { randomUUID } from 'node:crypto'
import { getNode } from '../thread'
import { createEventMetadata } from './createEventMetadata'

export interface ConfirmOption {
  question: string
  text?: string
  timeout?: number
}

export interface EventConfirmRequest extends ConfirmOption {
  id: string
}

export async function askConfirmation(thread: Thread, nodeId: string, options: ConfirmOption): Promise<boolean> {
  const { question, text, timeout = 60000 } = options
  const node = getNode(thread, nodeId)
  const eventConfirmRequest: EventConfirmRequest = { id: randomUUID(), question, text, timeout }
  let timeoutInstance: NodeJS.Timeout

  return new Promise((resolve, reject) => {
    if (typeof timeout === 'number' && timeout > 0) {
      timeoutInstance = setTimeout(() => {
        stopOnAbort()
        stopOnResponse()
        const error = new Error('Timeout.')
        reject(error)
      }, timeout)
    }
    const stopOnResponse = thread.on('nodeResponse', (thisId, event) => {
      if (thisId === nodeId && event.id === eventConfirmRequest.id) {
        if (timeoutInstance) clearTimeout(timeoutInstance)
        stopOnAbort()
        stopOnResponse()
        resolve(event.response as boolean)
      }
    })
    const stopOnAbort = thread.on('abort', () => {
      const error = new Error('Aborted by user.')
      if (timeoutInstance) clearTimeout(timeoutInstance)
      stopOnAbort()
      stopOnResponse()
      reject(error)
    })
    thread.dispatch(
      'nodeConfirmRequest',
      nodeId,
      eventConfirmRequest,
      createEventMetadata(thread, node),
    )
  })
}
