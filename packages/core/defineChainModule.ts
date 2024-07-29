import { ChainType } from './defineChainType'
import { ChainNodeConstructor } from './defineChainNode'
import { Chain } from './defineChain'

/** A collection of chain nodes. */
export type ChainModuleNodes = Record<string, ChainNodeConstructor>

/** A collection of chain types. */
export type ChainModuleTypes = Record<string, ChainType>

/** The options for defining a chain module. */
export interface ChainModuleOptions<
  Name extends string = string,
  Nodes extends ChainModuleNodes = ChainModuleNodes,
  Types extends ChainModuleTypes = ChainModuleTypes,
> {
  name: Name
  label: string
  description?: string
  nodes?: Nodes
  types?: Types
}

/**
 * A `ChainModule` is a module that defines a collection of nodes, types and chains
 * that can be used when building a chain. The module can be registered in a chain
 * to provide the nodes, types and chains that are defined in the module.
 */
export class ChainModule<
  Name extends string = string,
  Nodes extends ChainModuleNodes = {},
  Types extends ChainModuleTypes = {},
> {

  constructor(options: ChainModuleOptions<Name, Nodes, Types>) {
    this.name = options.name
    this.label = options.label
    this.description = options.description
    if (options.nodes) this.nodes = options.nodes
    if (options.types) this.types = options.types
  }

  name: Name
  label: string
  description?: string
  nodes: Nodes = {} as Nodes
  types: Types = {} as Types
  templates: Record<string, Chain> = {}

  static define<
    Name extends string = string,
    Nodes extends ChainModuleNodes = {},
    Types extends ChainModuleTypes = {},
  >(options: ChainModuleOptions<Name, Nodes, Types>,
  ) {
    return new ChainModule(options)
  }
}

export function defineChainModule<
  Name extends string = string,
  Nodes extends ChainModuleNodes = {},
  Types extends ChainModuleTypes = {},
>(options: ChainModuleOptions<Name, Nodes, Types>) {
  return ChainModule.define(options)
}
