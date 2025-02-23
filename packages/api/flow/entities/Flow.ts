import type { FlowV1 } from '@nwrx/nano'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Project } from '../../project'
import { User } from '../../user'
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
   * The user who created the project. Note that this user is not necessarily the owner of
   * the project. This field has no impact on the permissions of the project.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy: undefined | User

  /**
   * The assignments for this flow.
   */
  @OneToMany(() => FlowAssignment, assignment => assignment.flow, { cascade: ['insert'] })
  assignments: FlowAssignment[] | undefined

  /**
   * @returns The object representation of the icon.
   */
  serialize(): FlowObject {
    return {
      name: this.name,
      title: this.title,
      description: this.description,
      isPublic: this.isPublic,
    }
  }
}

export interface FlowObject {
  name: string
  title: string
  description?: string
  isPublic?: boolean
}
