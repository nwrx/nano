/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { ObjectLike } from '@unshared/types'
import type { ThreadError } from './createError'
import type { NodeEventMeta } from './createNode'
import type { ProcessContext } from './defineComponent'

export interface ThreadEventMeta {
  timestamp: string
  threadId: string
  threadDelta: number
}

export type ThreadEvents = {
  'start': [input: ObjectLike, meta: ThreadEventMeta]
  'error': [error: ThreadError, meta: ThreadEventMeta]
  'abort': [meta: ThreadEventMeta]
  'input': [name: string, value: unknown, meta: ThreadEventMeta]
  'output': [name: string, value: unknown, meta: ThreadEventMeta]
  'end': [output: ObjectLike, meta: ThreadEventMeta]
  'nodeState': [id: string, meta: NodeEventMeta]
  'nodeError': [id: string, error: ThreadError, meta: NodeEventMeta & ThreadEventMeta]
  'nodeTrace': [id: string, trace: ObjectLike, meta: NodeEventMeta & ThreadEventMeta]
  'nodeStart': [id: string, context: ProcessContext, meta: NodeEventMeta & ThreadEventMeta]
  'nodeEnd': [id: string, context: ProcessContext, meta: NodeEventMeta & ThreadEventMeta]
}
