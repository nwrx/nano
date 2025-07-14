import type { ObjectLike } from '@unshared/types'
import type { EventMapChat, EventMapConfirm, EventMapFetch, EventMapOutput, EventMapQuestion } from '../components'
import type { EventMetadata } from '../utils'
import type { NodeState } from './addNode'

export type ThreadEventMap =
  & EventMapChat
  & EventMapConfirm
  & EventMapFetch
  & EventMapOutput
  & EventMapQuestion
  & {
    'start': [input: ObjectLike]
    'error': [error: Error]
    'abort': [metadata: EventMetadata]
    'input': [name: string, value: unknown]
    'done': [output: ObjectLike]

    // Node events.
    'nodeState': [nodeId: string, state: NodeState]
    'nodeError': [nodeId: string, error: Error]
    'nodeTrace': [nodeId: string, trace: object]
    'nodeStart': [nodeId: string, data: ObjectLike]
    'nodeDone': [nodeId: string, result: ObjectLike]
  }
