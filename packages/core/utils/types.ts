/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { MaybeLiteral, MaybePromise, ObjectLike } from '@unshared/types'
import type { FlowError, Reference } from '.'
import type { FlowThreadNode } from '../flow/createFlowThreadNode'
import type { FlowNodeContext, FlowNodeDefinition } from '../module'

export interface FlowJSONv1Node {
  kind: string
  [key: string]: unknown
}

export interface FlowJSONv1Meta {
  name?: string
  icon?: string
  description?: string
}

export interface FlowJSONv1 {
  version: MaybeLiteral<'1'>
  nodes?: Record<string, FlowJSONv1Node>
}

/**
 * The function that is used to resolve a reference to a value. The resolve
 * function is used to resolve the reference to a value that can be used in
 * the flow.
 */
export type ResolveReference = (reference: Reference) => MaybePromise<unknown>

/**
 * The options that are used to create a new flow instance. The options can be
 * used to configure the flow instance with custom settings and resolvers.
 * The options can also be used to resolve references to values that are only
 * available at runtime.
 */
export interface FlowOptions {
  resolveNode?: Array<(kind: string) => MaybePromise<FlowNodeDefinition | void>>
  resolveReference?: ResolveReference[]
}

export interface FlowNodeMeta {
  label?: string
  comment?: string
  position?: { x: number; y: number }
  [key: string]: unknown
}

export interface FlowNode {
  id: string
  kind: string
  input?: ObjectLike
  meta?: FlowNodeMeta
}

/** The object representation of a link between two nodes in the flow. */
export interface FlowLink {
  sourceId: string
  sourceKey: string
  sourcePath?: string
  targetId: string
  targetKey: string
  targetPath?: string
}

export type FlowEvents = {
  'createNode': [node: FlowNode]
  'removeNodes': [nodes: FlowNode[]]
  'setNodeInputValue': [node: FlowNode, key: string, value: unknown]
  'setNodeMetaValue': [node: FlowNode, key: string, value: unknown]
}

/***************************************************************************/
/* Threads                                                                 */
/***************************************************************************/

export type FlowThreadState =
  | 'DONE'
  | 'ERROR'
  | 'IDLE'
  | 'RUNNING'

export interface FlowThreadEventMeta {
  threadId: string
  delta: number
  timestamp: number
}

export type FlowThreadEvents = {
  'start': [input: ObjectLike, meta: FlowThreadEventMeta]
  'error': [error: FlowError, meta: FlowThreadEventMeta]
  'abort': [meta: FlowThreadEventMeta]
  'input': [name: string, value: unknown, meta: FlowThreadEventMeta]
  'output': [name: string, value: unknown, meta: FlowThreadEventMeta]
  'end': [output: ObjectLike, meta: FlowThreadEventMeta]
  'nodeState': [node: FlowThreadNode, meta: FlowThreadNodeEventMeta]
  'nodeError': [node: FlowThreadNode, error: FlowError, meta: FlowThreadNodeEventMeta]
  'nodeStart': [node: FlowThreadNode, context: FlowNodeContext, meta: FlowThreadNodeEventMeta]
  'nodeEnd': [node: FlowThreadNode, context: FlowNodeContext, meta: FlowThreadNodeEventMeta]
}

/***************************************************************************/
/* Execution                                                               */
/***************************************************************************/

export type FlowThreadNodeState =
  | 'DONE'
  | 'ERROR'
  | 'IDLE'
  | 'RUNNING/PROCESSING'
  | 'RUNNING/RESOLVING_DEFINITION'
  | 'RUNNING/RESOLVING_INPUT'
  | 'RUNNING/RESOLVING_OUTPUT'

export interface FlowThreadNodeEventMeta extends FlowThreadEventMeta {
  state: FlowThreadNodeState
  duration: number
}

export type FlowThreadNodeEvents = {
  state: [meta: FlowThreadNodeEventMeta]
  error: [error: FlowError, meta: FlowThreadNodeEventMeta]
  start: [context: FlowNodeContext, meta: FlowThreadNodeEventMeta]
  end: [context: FlowNodeContext, meta: FlowThreadNodeEventMeta]
}
