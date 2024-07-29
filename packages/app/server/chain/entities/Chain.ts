import { Column, Entity } from 'typeorm'
import { UUID } from 'node:crypto'
import { Metadata, transformerJson } from '@unserved/server'
import { ChainNodeObject } from '@hsjm/oblisk-core'

export interface ChainObject {
  id: UUID
  name: string
  slug: string
  description: string
  nodes: ChainNodeObject[]
  links: Record<string, string>
}

/**
 * The Chain entity represents a chain of nodes that are connected to each other
 * and executed in sequence. The chain is used to define the flow of data between
 * the nodes and the order in which they are executed.
 */
@Entity({ name: 'Chain' })
export class Chain extends Metadata {

  /**
   * The name of the chain as displayed in the UI.
   *
   * @example 'Resume Article'
   */
  @Column('varchar', { length: 255 })
    name: string

  /**
   * The URL slug of the chain. The slug is used to generate the URL of the chain.
   * It is also used to identify the chain in the database.
   *
   * @example 'resume-article'
   */
  @Column('varchar', { length: 255 })
    slug: string

  /**
   * Description of the chain.
   *
   * @example 'This chain is used to resume an article.'
   */
  @Column('text', { default: '' })
    description = ''

  /**
   * The nodes that are part of the chain.
   *
   * @example [Node, Node, Node]
   */
  @Column('json', { transformer: transformerJson })
    nodes: ChainNodeObject[] = []

  /**
   * The links between the nodes in the chain.
   *
   * @example [Link, Link, Link]
   */
  @Column('json', { transformer: transformerJson })
    links: Record<string, string> = {}

  /**
   * @returns The object representation of the icon.
   */
  serialize(): ChainObject {
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
