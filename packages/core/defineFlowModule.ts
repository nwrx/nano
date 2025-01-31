/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { FlowNode, FlowNodeJSON } from './defineFlowNode'
import type { FlowType, FlowTypeJSON } from './defineFlowType'
import { assertStringNotEmpty } from '@unshared/validation'

/** A collection of flow nodes. */
export type FlowModuleNodes = Record<string, FlowNode<string, any, any>>
export type FlowModuleTypes = Record<string, FlowType<any>>

/** The serialized representation of a flow module. */
export interface FlowModuleJSON {
  kind: string
  name: string
  description: string
  nodes: FlowNodeJSON[]
  types: FlowTypeJSON[]
}

/** The options for defining a flow module. */
export interface FlowModuleOptions<
  Kind extends string = string,
  Nodes extends FlowModuleNodes = FlowModuleNodes,
  Types extends FlowModuleTypes = FlowModuleTypes,
> {

  /**
   * The internal name of the flow module. The name is used to identify the module
   * in the backend and should be unique to the module. The name should be a camel
   * case string without spaces or special characters.
   *
   * @example 'microsoft-azure'
   */
  kind: Kind

  /**
   * The display name of the flow module. The label is used to display the module
   * in the UI and should be a human-readable string that describes the module
   * to the user.
   *
   * @example 'Microsoft Azure'
   */
  name: string

  /**
   * The icon of the flow module. The icon is used to display the module in the UI
   * and should be a URL to an image that represents the module. The icon should be
   * a square image with a transparent background and a size of 24x24 pixels.
   *
   * @example 'https://api.iconify.design/carbon:cloud.svg'
   */
  icon?: string

  /**
   * The description of the flow module. The description is used to provide more
   * information about the module to the user. The description can be a short
   * description of the module or a detailed description of the module.
   *
   * @example 'A collection of nodes for working with Microsoft Azure services.'
   */
  description?: string

  /**
   * The nodes that are defined in the flow module. The nodes are used to define
   * the logic of the flow and can be connected to other nodes to create a flow
   *
   * @example { CheckCredentials, CreateResource, DeleteResource }
   */
  nodes?: Nodes

  /**
   * The types that are defined in the flow module. The types are used to define
   * the data types that are used in the flow and can be used to validate the
   * data that is passed between nodes in the flow.
   *
   * @example { AzureCredentials, AzureResource }
   */
  types?: Types
}

export interface FlowModule<
  Kind extends string = string,
  Nodes extends FlowModuleNodes = FlowModuleNodes,
  Types extends FlowModuleTypes = FlowModuleTypes,
> extends Required<FlowModuleOptions<Kind, Nodes, Types>> {

  /**
   * The internal name of the flow module. The name is used to identify the module
   * in the backend and should be unique to the module. The name should be a camel
   * case string without spaces or special characters.
   */
  toString(): Kind

  /**
   * Serialize the flow module to a JSON object. The JSON object can be used to
   * store the flow module in a database or to send the flow module over the network.
   * The JSON object contains the name, label, description, nodes, and types of the module.
   */
  toJSON(): FlowModuleJSON
}

/**
 * Define a flow module with the given options. The module can be registered in a
 * flow to provide the nodes, types and flows that can be used when building a flow.
 *
 * @param options The options to define the flow module with.
 * @returns The flow module created with the given options.
 */
export function defineFlowModule<
  Kind extends string = string,
  Nodes extends FlowModuleNodes = {},
  Types extends FlowModuleTypes = {},
>(options: FlowModuleOptions<Kind, Nodes, Types>): FlowModule<Kind, Nodes, Types> {
  assertStringNotEmpty(options.kind)
  return {
    kind: options.kind,
    name: options.name ?? options.kind,
    icon: options.icon ?? '',
    description: options.description ?? '',
    nodes: options.nodes ?? {} as Nodes,
    types: options.types ?? {} as Types,
    toString() {
      return this.kind
    },
    toJSON() {
      return {
        kind: this.kind,
        name: this.name,
        description: this.description,
        nodes: Object.values(this.nodes).map(node => node.toJSON()),
        types: Object.values(this.types).map(type => type.toJSON()),
      }
    },
  }
}
