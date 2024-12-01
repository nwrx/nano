import type { FlowThreadEventMeta, FlowThreadNodeEventMeta, SocketListOption } from '@nwrx/core'
import type { ObjectLike } from '@unshared/types'
import type { FlowJSON, FlowThreadNodeJSON } from './serializeFlowSession'

export interface FlowSessionEventMap {
  'init': FlowJSON
  'user:join': { id: string; name: string; color: string }
  'user:leave': { id: string }
  'user:position': { id: string; x: number; y: number }
  'meta': { key: string; value: unknown }
  'error': { message: string }
  'thread:start': FlowThreadEventMeta & { input: Record<string, unknown> }
  'thread:abort': FlowThreadEventMeta
  'thread:error': { code?: string; message: string }
  'thread:end': FlowThreadEventMeta & { output: Record<string, unknown> }
  'thread:input': FlowThreadEventMeta & { name: string; value: unknown }
  'thread:output': FlowThreadEventMeta & { name: string; value: unknown }
  'thread:nodeState': FlowThreadNodeEventMeta & { id: string }
  'thread:nodeStart': FlowThreadNodeEventMeta & { id: string; input: Record<string, unknown> }
  'thread:nodeTrace': FlowThreadNodeEventMeta & { id: string; data: ObjectLike }
  'thread:nodeError': FlowThreadNodeEventMeta & { id: string; code?: string; message: string; context: Record<string, unknown> }
  'thread:nodeEnd': FlowThreadNodeEventMeta & { id: string; input: Record<string, unknown>; output: Record<string, unknown> }
  'variables:create': { name: string; value: string }
  'variables:update': { name: string; value: string }
  'variables:remove': { name: string }
  'secrets:create': { name: string; value: string }
  'secrets:update': { name: string; value: string }
  'secrets:remove': { name: string }
  'node:created': FlowThreadNodeJSON
  'node:removed': { ids: string[] }
  'node:metaValueChanged': { id: string; key: string; value: unknown }
  'node:inputValueChanged': { id: string; key: string; value: unknown }
  'node:inputOptionResult': { id: string; key: string; options: SocketListOption[] }
}

export type FlowSessionEventName = keyof FlowSessionEventMap
export type FlowSessionEventPayload<K extends FlowSessionEventName = FlowSessionEventName> =
  { [P in K]: FlowSessionEventMap[P] & { event: P } }[K]
