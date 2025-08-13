import type { ComponentPurpose } from '@nwrx/nano/utils'

export interface FlowSchema {
  title: string
  description?: string
  inputs: FlowSchema.Input[]
  outputs: FlowSchema.Output[]
  nodes: FlowSchema.Node[]
}

export namespace FlowSchema {
  export interface Node {
    id: string
    icon: string
    title: Record<string, string> | string
    specifier: string
    color: string
    purpose: ComponentPurpose
  }

  export interface Input {
    id: string
    type: 'string'
    name: string
    label: string
    description?: string
    required: boolean
  }

  export interface Output {
    id: string
    type: 'string'
    name: string
    title: string
    description?: string
  }
}
