import type { Node } from '@nwrx/nano'
import type { Component, ComponentPurpose, Schema } from '@nwrx/nano/utils'
import type { LooseDeep } from '@unshared/types'
import type { FlowObject } from '../../flow'
import type {
  MessageServerMetadataChanged,
  MessageServerNodesCreated,
  MessageServerNodesInputChanged,
  MessageServerNodesMetadataChanged,
  MessageServerNodesOptionsResult,
  MessageServerNodesPropertiesResult,
  MessageServerNodesRemoved,
  MessageServerRequestExportResult,
  MessageServerRequestReloadResult,
  MessageServerUserLeft,
  MessageServerUserMoved,
} from './eventHandlers'
import type { MESSAGE_CLIENT_SCHEMA } from './messages'

export namespace Editor {
  export interface ComponentObject {
    name: string
    version: string
    icon?: string
    parent?: string
    purpose?: ComponentPurpose
    title?: Localizeable | string
    description?: Localizeable | string
    inputs?: Record<string, Schema>
    outputs?: Record<string, Schema>
  }

  export interface ComponentGroup {
    name: ComponentPurpose
    icon?: string
    color?: string
    title?: Localizeable | string
    description?: Localizeable | string
  }

  export type ComponentWithSerializer = Component & {
    serialize?: () => ComponentObject
  }

  export interface NodeObject extends Omit<Node, 'component'> {
    id: string
    specifier: string
  }

  export interface ParticipantObject {
    id: string
    name: string
    color: string
    position: { x: number; y: number }
  }

  export interface State {
    flow: FlowObject
    nodes: Editor.NodeObject[]
    participants: ParticipantObject[]
  }

  export interface Localizeable {
    en?: string
    fr?: string
    de?: string
    es?: string
    zh?: string
  }

  export type MessageClient = ReturnType<typeof MESSAGE_CLIENT_SCHEMA>
  export type MessageClientEvent = MessageClient['event']

  export interface MessageServerError {
    event: 'editor.error'
    data: { name: string; message: string }
  }

  export interface MessageServerUserJoined {
    event: 'user.joined'
    data: Array<{
      id: string
      name: string
      color: string
    }>
  }

  export type MessageServer =
    | MessageServerError
    | MessageServerMetadataChanged
    | MessageServerNodesCreated
    | MessageServerNodesInputChanged
    | MessageServerNodesMetadataChanged
    | MessageServerNodesOptionsResult
    | MessageServerNodesPropertiesResult
    | MessageServerNodesRemoved
    | MessageServerRequestExportResult
    | MessageServerRequestReloadResult
    | MessageServerUserJoined
    | MessageServerUserLeft
    | MessageServerUserMoved

  export type MessageClientDataByName<K extends MessageClient['event']> = MessageClient extends infer T
    ? T extends { event: K; data: infer D } ? LooseDeep<D> : never
    : never

}
