/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { MaybeLiteral, ObjectLike } from '@unshared/types'
import type { ThreadError } from '.'
import type { NodeContext } from '../module'

export interface FlowV1ComponentInstance {
  kind: string
  [key: string]: unknown
}

export interface FlowV1Meta {
  name?: string
  icon?: string
  description?: string
}

export interface FlowV1 {
  version: MaybeLiteral<'1'>
  nodes?: Record<string, FlowV1ComponentInstance>
  components?: Record<string, FlowV1ComponentInstance>
}

export interface ComponentInstanceMeta {
  label?: string
  comment?: string
  position?: { x: number; y: number }
  [key: string]: unknown
}

export interface ComponentInstance {
  kind: string
  input?: ObjectLike
  meta?: ComponentInstanceMeta
}

/** The object representation of a link between two nodes in the flow. */
export interface Link {
  sourceId: string
  sourceName: string
  sourcePath?: string
  targetId: string
  targetName: string
  targetPath?: string
}

/***************************************************************************/
/* Threads                                                                 */
/***************************************************************************/

export type ThreadState =
  | 'DONE'
  | 'ERROR'
  | 'IDLE'
  | 'RUNNING'

export interface ThreadEventMeta {
  timestamp: number
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
  'nodeStart': [id: string, context: NodeContext, meta: NodeEventMeta & ThreadEventMeta]
  'nodeEnd': [id: string, context: NodeContext, meta: NodeEventMeta & ThreadEventMeta]
}

/***************************************************************************/
/* Execution                                                               */
/***************************************************************************/

export type NodeState =
  | 'DONE'
  | 'ERROR'
  | 'IDLE'
  | 'PROCESSING'

export interface NodeEventMeta {
  nodeState: NodeState
  nodeDuration: number
}

export type NodeEvents = {
  state: [meta: NodeEventMeta]
  error: [error: ThreadError, meta: NodeEventMeta]
  trace: [trace: ObjectLike, meta: NodeEventMeta]
  start: [context: NodeContext, meta: NodeEventMeta]
  end: [context: NodeContext, meta: NodeEventMeta]
}
