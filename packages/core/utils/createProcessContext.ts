import type { ObjectLike } from '@unshared/types'
import type { Thread } from '../thread'
import type { ProcessContext } from './defineComponent'
import { getNodeData } from '../thread'
import { askConfirmation } from './askConfirmation'
import { askQuestion } from './askQuestion'
import { notifyAction } from './notifyAction'

export async function createProcessContext(thread: Thread, id: string, data?: ObjectLike): Promise<ProcessContext> {
  return {
    data: data ?? await getNodeData(thread, id),
    abortSignal: thread.abortController.signal,
    notifyAction: options => notifyAction(thread, id, options),
    askQuestion: options => askQuestion(thread, id, options),
    askConfirmation: options => askConfirmation(thread, id, options),
  }
}
