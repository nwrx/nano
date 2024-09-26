import { BaseEntity, transformerSemver } from '@unserved/server'
import { Semver } from '@unshared/string'
import { UUID } from 'node:crypto'
import { Column, Entity } from 'typeorm'

/**
 * A `FlowModule` represents a collection of nodes, types and flows that can be
 * used when building a flow. The module can be registered in a flow to provide
 * the nodes, types and flows that are defined in the module.
 */
@Entity({ name: 'FlowModule' })
export class FlowModule extends BaseEntity {

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
   * Description of the module.
   *
   * @example 'This module is used to resume articles.'
   */
  @Column('text', { nullable: true })
  description?: string

  /**
   * The version of the module. It is a `Semver` instance that represents the
   * semantic version of the module.
   *
   * @example Semver { major: 1, minor: 0, patch: 0 }
   */
  @Column('varchar', { length: 255, transformer: transformerSemver })
  version: Semver

  /**
   * The module ID of the module.
   */
  @Column('varchar', { length: 255 })
  moduleId: string

  /**
   * The checksum of the module. It is used to verify the integrity of the module
   * when it is loaded in the backend to ensure that the module has not been tampered
   * with.
   */
  @Column('varchar', { length: 255 })
  checksum: string

  /**
   * @returns The object representation of the icon.
   */
  serialize(): FlowModuleObject {
    return {
      id: this.id,
      name: this.name,
      slug: this.kind,
      version: this.version.toString(),
      description: this.description,
    }
  }
}

export interface FlowModuleObject {
  id: UUID
  name: string
  slug: string
  version: string
  description?: string
}
