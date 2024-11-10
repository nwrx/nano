import { FlowJSONv1 } from '@nwrx/core'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { WorkspaceProject } from '../../workspace'

/**
 * The Flow entity represents a flow of nodes that are connected to each other
 * and executed in sequence. The flow is used to define the flow of data between
 * the nodes and the order in which they are executed.
 */
@Entity({ name: 'Flow' })
@Unique('Unique', ['name', 'project'])
export class Flow extends BaseEntity {

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
  @Column('varchar')
  title: string

  /**
   * Description of the flow.
   *
   * @example 'This flow is used to resume an article.'
   */
  @Column('text')
  description: string

  /**
   * The nodes that are part of the flow.
   *
   * @example [Node, Node, Node]
   */
  @Column('json', { default: '{"version":"1"}', transformer: transformerJson })
  data: FlowJSONv1 = { version: '1' }

  /**
   * The project that the flow is part of.
   *
   * @example WorkspaceProject { ... }
   */
  @JoinColumn()
  @ManyToOne(() => WorkspaceProject, project => project.flows, { onDelete: 'CASCADE', nullable: false })
  project?: WorkspaceProject

  /**
   * @param options The options to use when serializing the object.
   * @returns The object representation of the icon.
   */
  serialize(options: SerializeOptions = {}): FlowObject {
    return {
      name: this.name,
      title: this.title,
      description: this.description,
      workspace: this.project?.workspace?.name,
      project: this.project?.name,
      data: options.withData ? this.data : undefined,
    }
  }
}

interface SerializeOptions {
  withData?: boolean
}

export interface FlowObject {
  name: string
  title: string
  description?: string
  workspace?: string
  project?: string
  data?: FlowJSONv1
}
