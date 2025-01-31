import type { Thread } from '../../../thread'
import { createEventMetadata } from '../../../utils/createEventMetadata'

export interface EventRequestError {
  id: string
  status: number
  statusText: string
}

export function notifyRequestError(thread: Thread, nodeId: string, event: EventRequestError) {
  thread.dispatch(
    'nodeRequestError',
    nodeId,
    event,
    createEventMetadata(thread, nodeId),
  )
}
