import type { FlowV1 } from '@nwrx/nano'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm'
import { Project } from '../../project'
import { FlowAssignment } from './FlowAssignment'

/**
 * The Flow entity represents a flow of nodes that are connected to each other
 * and executed in sequence. The flow is used to define the flow of data between
 * the nodes and the order in which they are executed.
 */
@Entity({ name: 'Flow' })
@Unique(['project', 'name'])
export class Flow extends BaseEntity {

  /**
   * The project that the flow is part of.
   *
   * @example Project { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Project, project => project.flows, { nullable: false })
  project?: Project

  /**
   * The URL slug of the flow. The slug is used to generate the URL of the flow.
   * It is also used to identify the flow in the database.
   *
   * @example 'resume-article'
   */
  @Column('varchar', { unique: false })
  name: string

  /**
   * The name of the flow as displayed in the UI.
   *
   * @example 'Resume Article'
   */
  @Column('varchar', { length: 255, default: '' })
  title = ''

  /**
   * Description of the flow.
   *
   * @example 'This flow is used to resume an article.'
   */
  @Column('text', { default: '' })
  description = ''

  /**
   * The specificataion of the flow.
   *
   * @example { version: '1', nodes: {}, metadata: {} }
   */
  @Column('json', { default: '{"version":"1"}', transformer: transformerJson })
  data: FlowV1 = { version: '1', nodes: {}, metadata: {} }

  /**
   * The assignments for this flow.
   */
  @OneToMany(() => FlowAssignment, assignment => assignment.flow)
  assignments?: FlowAssignment[]

  /**
   * @returns The object representation of the icon.
   */
  serialize(): FlowObject {
    return {
      name: this.name,
      title: this.title,
      description: this.description,
      workspace: this.project?.workspace?.name,
      project: this.project?.name,
    }
  }
}

export interface FlowObject {
  name: string
  title: string
  description?: string
  workspace?: string
  project?: string
}
