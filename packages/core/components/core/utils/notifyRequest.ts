import type { ObjectLike } from '@unshared/types'
import type { Thread } from '../../../thread'
import { createEventMetadata } from '../../../utils/createEventMetadata'

export interface EventRequest {
  id: string
  url: string
  body: ObjectLike
  query: ObjectLike
  method: string
  headers: ObjectLike
  parameters: ObjectLike
}

export function notifyRequest(thread: Thread, nodeId: string, event: EventRequest) {
  thread.dispatch(
    'nodeRequest',
    nodeId,
    event,
    createEventMetadata(thread, nodeId),
  )
}
