import type { FlowV1 } from '@nwrx/nano'
import { BaseEntity, transformerJson, transformerSemver } from '@unserved/server'
import { Semver } from '@unshared/string/createSemver'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { Flow } from './Flow'

/**
 * The FlowDeployment entity represents a deployed version of a flow.
 * It contains the flow data and metadata about the deployment.
 */
@Entity({ name: 'FlowDeployment' })
@Unique(['flow', 'version'])
export class FlowDeployment extends BaseEntity {

  /**
   * The flow that this deployment belongs to.
   */
  @JoinColumn()
  @ManyToOne(() => Flow, { nullable: false })
  flow?: Flow

  /**
   * The version of the flow. This allows use to store multiple versions of the
   * flow in the registry and provide users with the ability to select the version
   * they want to use.
   *
   * @example '1.0.0'
   */
  @Column('varchar', { length: 255, transformer: transformerSemver })
  version: Semver

  /**
   * The deployed flow data.
   */
  @Column('json', { transformer: transformerJson })
  data: FlowV1

  /**
   * Notes about this deployment.
   */
  @Column('text', { nullable: true })
  notes?: string

  /**
   * @returns The object representation of the deployment.
   */
  serialize(): FlowDeploymentObject {
    return {
      version: this.version.toString(),
      notes: this.notes,
      createdAt: this.createdAt,
    }
  }
}

export interface FlowDeploymentObject {
  version: string
  notes?: string
  createdAt: Date
}
