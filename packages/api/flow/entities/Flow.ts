import type { FlowV1 } from '@nwrx/nano'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Project } from '../../project'
import { User, UserObject } from '../../user'
import { FlowAssignment } from './FlowAssignment'

/**
 * The Flow entity represents a flow of nodes that are connected to each other
 * and executed in sequence. The flow is used to define the flow of data between
 * the nodes and the order in which they are executed.
 */
@Entity({ name: 'Flow' })
@Index(['project', 'name', 'deletedAt'], { unique: true })
export class Flow extends BaseEntity {

  /**
   * The project that the flow is part of.
   *
   * @example Project { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Project, { nullable: false })
  project: Project | undefined

  /**
   * The URL slug of the flow. The slug is used to generate the URL of the flow.
   * It is also used to identify the flow in the database.
   *
   * @example 'resume-article'
   */
  @Column('varchar')
  name: string

  /**
   * The name of the flow as displayed in the UI.
   *
   * @example 'Resume Article'
   */
  @Column('varchar')
  title = ''

  /**
   * Description of the flow.
   *
   * @example 'This flow is used to resume an article.'
   */
  @Column('text')
  description = ''

  /**
   * The specificataion of the flow.
   *
   * @example { version: '1', nodes: {}, metadata: {} }
   */
  @Column('json', { transformer: transformerJson })
  data: FlowV1 = { version: '1', nodes: {}, metadata: {} }

  /**
   * Whether the flow is public or not. If the flow is public, it can be accessed
   * by anyone having read access to the project.
   *
   * @example true
   */
  @Column('boolean')
  isPublic = false

  /**
   * The assignments for this flow.
   */
  @OneToMany(() => FlowAssignment, assignment => assignment.flow, { cascade: ['insert'] })
  assignments: FlowAssignment[] | undefined

  /**
   * The user that created the flow.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy?: User

  /**
   * The user that last updated the flow.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updatedBy?: null | User

  /**
   * The user responsible for deleting the flow.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  deletedBy?: null | User

  /**
   * @param options The options to serialize the flow with.
   * @returns The object representation of the icon.
   */
  serialize(options: SerializeOptions = {}): FlowObject {
    const {
      withCreatedBy = false,
      withUpdatedBy = false,
      withDeleted = false,
    } = options
    return {
      name: this.name,
      title: this.title,
      description: this.description,
      isPublic: this.isPublic,

      // Metadata
      createdAt: withCreatedBy ? this.createdAt?.toISOString() : undefined,
      createdBy: withCreatedBy ? this.createdBy?.serialize() : undefined,
      updatedAt: withUpdatedBy ? this.updatedAt?.toISOString() : undefined,
      updatedBy: withUpdatedBy ? this.updatedBy?.serialize() : undefined,
      deletedAt: withDeleted ? this.deletedAt?.toISOString() : undefined,
      deletedBy: withDeleted ? this.deletedBy?.serialize() : undefined,
    }
  }
}

interface SerializeOptions {
  withCreatedBy?: boolean
  withUpdatedBy?: boolean
  withDeleted?: boolean
}

export interface FlowObject {
  name: string
  title: string
  description?: string
  isPublic?: boolean

  // Metadata
  createdAt?: string
  createdBy?: UserObject
  updatedAt?: string
  updatedBy?: UserObject
  deletedAt?: string
  deletedBy?: UserObject
}
