import { BaseEntity } from '@unserved/server'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { Workspace } from '../../workspace'
import { RegistryComponent } from './RegistryComponent'

/**
 * A `RegistryCollection` is a collection of components and templates that are grouped together
 * to provide a set of functionalities or features. It allows users to publish and share their
 * integrations with others in the community.
 *
 * For example, the `notion` collection could be used to group components that are used to interact
 * with the Notion API. The collection could contain components like `notion-get-block` and `notion-create-block`.
 */
@Entity({ name: 'RegistryCollection' })
export class RegistryCollection extends BaseEntity {

  /**
   * The name of the collection.
   *
   * @example 'notion'
   */
  @Column('varchar', { length: 255, unique: true })
  name: string

  /**
   * The title of the collection.
   *
   * @example 'Notion'
   */
  @Column('varchar', { length: 255 })
  title: string

  /**
   * The icon of the collection.
   *
   * @example 'https://example.com/icon.png'
   */
  @Column('varchar', { length: 255, default: '' })
  icon: string

  /**
   * The description of the collection.
   *
   * @example 'This collection contains components for Notion.'
   */
  @Column('text', { default: '' })
  description: string

  /**
   * A list of components in the collection.
   *
   * @example [Component { name: 'notion-get-block', title: 'Get Block', ... }]
   */
  @OneToMany(() => RegistryComponent, component => component.collection)
  components: RegistryComponent[]

  /**
   * The workspace that the collection is associated with.
   *
   * @example Workspace { name: 'notion', title: 'Notion', ... }
   */
  @ManyToOne(() => Workspace, { nullable: false })
  workspace: Workspace
}
