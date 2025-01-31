import type { Thread } from '../../../thread'
import { createEventMetadata } from '../../../utils/createEventMetadata'

export interface EventRequestResponse {
  id: string
  status: number
  statusText: string
}

export function notifyRequestResponse(thread: Thread, nodeId: string, event: EventRequestResponse) {
  thread.dispatch(
    'nodeRequestResponse',
    nodeId,
    event,
    createEventMetadata(thread, nodeId),
  )
}
