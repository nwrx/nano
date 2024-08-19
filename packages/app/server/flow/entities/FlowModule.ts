import { FlowModule as FlowModuleInstance, FlowNodeJSON, FlowTypeJSON } from '@nanoworks/core'
import { Metadata, transformerSemver } from '@unserved/server'
import { Semver } from '@unshared/string'
import { UUID } from 'node:crypto'
import { Column, Entity } from 'typeorm'
import { Once } from 'unshared'

/**
 * A `FlowModule` represents a collection of nodes, types and flows that can be
 * used when building a flow. The module can be registered in a flow to provide
 * the nodes, types and flows that are defined in the module.
 */
@Entity({ name: 'FlowModule' })
export class FlowModule extends Metadata {

  /**
   * The kind of the module. The kind is used to identify the module in the
   * backend and should be unique across all modules.
   *
   * @example 'microsoft-azure'
   */
  @Column('varchar', { unique: true, length: 255 })
  kind: string

  /**
   * The name of the module as displayed in the UI.
   *
   * @example 'Microsoft Azure'
   */
  @Column('varchar', { length: 255 })
  name: string

  /**
   * The version of the module. It is a `Semver` instance that represents the
   * semantic version of the module.
   *
   * @example Semver { major: 1, minor: 0, patch: 0 }
   */
  @Column('varchar', { nullable: true, length: 255, transformer: transformerSemver })
  version?: Semver

  /**
   * Description of the module.
   *
   * @example 'This module is used to resume articles.'
   */
  @Column('text', { default: '' })
  description = ''

  /**
   * The module ID of the module.
   */
  @Column('varchar', { length: 255 })
  moduleId: string

  /**
   * Load the JavaScript module that is associated with the module.
   *
   * @returns The module that is associated with the module.
   */
  @Once()
  async loadModule(): Promise<FlowModuleInstance> {
    const moduleImport = await import(this.moduleId) as { default: FlowModuleInstance }
    if (!moduleImport) throw new Error(`Failed to load module: ${this.moduleId}`)
    if (!moduleImport.default) throw new Error(`Module does not have a default export: ${this.moduleId}`)
    return moduleImport.default
  }

  /**
   * Load the nodes that are defined in the module.
   *
   * @returns The nodes that are defined in the module.
   */
  @Once()
  async loadNodes(): Promise<FlowNodeJSON[]> {
    const module = await this.loadModule()
    return Object.values(module.nodes).map(node => node.toJSON())
  }

  /**
   * Load the types that are defined in the module.
   *
   * @returns The types that are defined in the module.
   */
  @Once()
  async loadTypes(): Promise<FlowTypeJSON[]> {
    const module = await this.loadModule()
    return Object.values(module.types).map(type => type.toJSON())
  }

  /**
   * @param options The options to use when serializing the object.
   * @returns The object representation of the icon.
   */
  async serialize(options: SerializeOptions = {}): Promise<FlowModuleObject> {
    return {
      id: this.id,
      name: this.name,
      slug: this.kind,
      version: this.version?.toString() ?? '0.0.0',
      moduleId: this.moduleId,
      description: this.description,
      nodes: options.withNodes ? await this.loadNodes() : undefined,
      types: options.withTypes ? await this.loadTypes() : undefined,
    }
  }
}

interface SerializeOptions {
  withNodes?: boolean
  withTypes?: boolean
}

export interface FlowModuleObject {
  id: UUID
  name: string
  slug: string
  version: string
  moduleId: string
  description: string
  nodes?: FlowNodeJSON[]
  types?: FlowTypeJSON[]
}
