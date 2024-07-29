import { Column, Entity } from 'typeorm'
import { UUID } from 'node:crypto'
import { Metadata } from '../../../../@server'

/**
 * A `ChainModule` represents a collection of chains that are related to each other.
 * The module is used to group chains that are related to each other.
 */
@Entity({ name: 'ChainModule' })
export class ChainModule extends Metadata {

  /**
   * The name of the module as displayed in the UI.
   *
   * @example 'Resume'
   */
  @Column('varchar', { length: 255 })
    name: string

  /**
   * The URL slug of the module. The slug is used to generate the URL of the module.
   * It is also used to identify the module in the database.
   *
   * @example 'resume'
   */
  @Column('varchar', { length: 255 })
    slug: string

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
   * @returns The object representation of the icon.
   */
  serialize(): ChainModuleObject {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      moduleId: this.moduleId,
      description: this.description,
    }
  }
}

export interface ChainModuleObject {
  id: UUID
  name: string
  slug: string
  moduleId: string
  description: string
}
