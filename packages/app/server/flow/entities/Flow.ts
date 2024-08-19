import { FlowNodeInstanceJSON } from '@nanoworks/core'
import { Metadata, transformerJson } from '@unserved/server'
import { UUID } from 'node:crypto'
import { Column, Entity } from 'typeorm'

/**
 * The Flow entity represents a flow of nodes that are connected to each other
 * and executed in sequence. The flow is used to define the flow of data between
 * the nodes and the order in which they are executed.
 */
@Entity({ name: 'Flow' })
export class Flow extends Metadata {

  /**
   * The name of the flow as displayed in the UI.
   *
   * @example 'Resume Article'
   */
  @Column('varchar', { length: 255 })
  name: string

  /**
   * The URL slug of the flow. The slug is used to generate the URL of the flow.
   * It is also used to identify the flow in the database.
   *
   * @example 'resume-article'
   */
  @Column('varchar', { length: 255 })
  slug: string

  /**
   * Description of the flow.
   *
   * @example 'This flow is used to resume an article.'
   */
  @Column('text', { default: '' })
  description = ''

  /**
   * The nodes that are part of the flow.
   *
   * @example [Node, Node, Node]
   */
  @Column('json', { transformer: transformerJson })
  nodes: FlowNodeInstanceJSON[] = []

  /**
   * The links between the nodes in the flow.
   *
   * @example [Link, Link, Link]
   */
  @Column('json', { transformer: transformerJson })
  links: Record<string, string> = {}

  /**
   * @returns The object representation of the icon.
   */
  serialize(): FlowObject {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      nodes: this.nodes,
      links: this.links,
    }
  }
}

export interface FlowObject {
  id: UUID
  name: string
  slug: string
  description: string
  nodes: FlowNodeInstanceJSON[]
  links: Record<string, string>
}
