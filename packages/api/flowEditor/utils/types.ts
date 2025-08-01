import type { Node } from '@nwrx/nano'
import type { Component, Schema } from '@nwrx/nano/utils'
import type { FlowObject } from '../../flow'

export namespace Editor {
  export type ComponentPurpose =
    | 'control'
    | 'integration'
    | 'model'
    | 'network'
    | 'other'
    | 'processing'

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
}
