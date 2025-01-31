import type { MaybePromise } from '@unshared/types'
import type { Component } from '../utils/defineComponent'

/** The resolver for a flow node. */
export type ModuleComponents =
  | (() => MaybePromise<Record<string, Component>>)
  | Record<string, Component>

/** The options for defining a flow module. */
export interface Module<K extends string = string> {

  /**
   * The internal name of the flow module. The name is used to identify the module
   * in the backend and should be unique to the module. The name should be a camel
   * case string without spaces or special characters.
   *
   * @example 'microsoft-azure'
   */
  name: K

  /**
   * The display name of the flow module. The label is used to display the module
   * in the UI and should be a human-readable string that describes the module
   * to the user.
   *
   * @example 'Microsoft Azure'
   */
  title?: string

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
  components?: ModuleComponents
}

/**
 * Define a flow module with the given options. The module can be registered in a
 * flow to provide the nodes, types and flows that can be used when building a flow.
 *
 * @param options The options to define the flow module with.
 * @returns The flow module created with the given options.
 */
export function defineModule<K extends string>(options: Module<K>): Module<K> {
  return {
    name: options.name,
    icon: options.icon,
    title: options.title ?? options.name,
    description: options.description,
    components: options.components,
  }
}
