import { BaseEntity } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { User } from '../../user'
import { Workspace, WorkspaceObject } from '../../workspace'
import { RegistryCategory, RegistryCategoryObject } from './RegistryCategory'
import { RegistryComponent, RegistryComponentObject } from './RegistryComponent'

/**
 * A `RegistryCollection` is a collection of components and templates that are grouped together
 * to provide a set of functionalities or features. It allows users to publish and share their
 * integrations with others in the community.
 *
 * For example, the `notion` collection could be used to group components that are used to interact
 * with the Notion API. The collection could contain components like `notion-get-block` and `notion-create-block`.
 */
@Entity({ name: 'RegistryCollection' })
@Index(['workspace', 'name'], { unique: true })
export class RegistryCollection extends BaseEntity {

  /**
   * The workspace that the collection is associated with.
   *
   * @example Workspace { name: 'notion', ... }
   */
  @ManyToOne(() => Workspace, { nullable: false })
  workspace: undefined | Workspace

  /**
   * The user who created the project. Note that this user is not necessarily the owner of
   * the project. This field has no impact on the permissions of the project.
   *
   * Native collections are created by the system and do not have a `createdBy` user.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy: undefined | User

  /**
   * The name of the collection.
   *
   * @example 'notion'
   */
  @Column('varchar')
  name: string

  /**
   * The title of the collection.
   *
   * @example 'Notion'
   */
  @Column('varchar')
  title: string

  /**
   * The icon of the collection.
   *
   * @example 'https://example.com/icon.png'
   */
  @Column('varchar')
  icon = ''

  /**
   * The long summary of the collection. This field uses markdown to format the text
   * and can contain links and images.
   *
   * @example '# Notion Collection\n\nThis collection contains components for Notion.'
   */
  @Column('text')
  summary = ''

  /**
   * The short description of the collection.
   *
   * @example 'This collection contains components for Notion.'
   */
  @Column('text')
  description = ''

  /**
   * Flag to declare the project as public. If the project is public, it can be viewed
   * by anyone without the need to authenticate to the project. By default, the project
   * is private and only the users assigned to the project can view it.
   *
   * @example false
   */
  @Column('boolean')
  isPublic = false

  /**
   * A list of components in the collection.
   *
   * @example [RegistryComponent, RegistryComponent, ...]
   */
  @OneToMany(() => RegistryComponent, component => component.collection)
  components: RegistryComponent[] | undefined

  /**
   * Get all the categories of the components within the collection.
   *
   * @returns The list of categories in the collection.
   */
  getCategories(): RegistryCategory[] | undefined {
    if (!this.components) return undefined
    const categories = new Map<string, RegistryCategory>()
    for (const component of this.components) {
      if (component.categories) {
        for (const category of component.categories)
          categories.set(category.name, category)
      }
    }
    return [...categories.values()]
  }

  /**
   * @param options The options to serialize the collection with.
   * @returns The serialized representation of the collection.
   */
  serialize(options: SerializeOptions = {}): RegistryCollectionObject {
    const { withCategories, withComponents, withWorkspace, ...serializeComponentOptions } = options
    return {
      name: this.name,
      title: this.title,
      icon: this.icon,
      summary: this.summary,
      description: this.description,
      isPublic: this.isPublic,
      updatedAt: this.updatedAt.toISOString(),
      createdAt: this.createdAt.toISOString(),
      workspace: withWorkspace ? this.workspace?.serialize() : undefined,
      categories: withCategories ? this.getCategories()?.map(category => category.serialize()) : undefined,
      components: withComponents ? this.components?.map(component => component.serialize(serializeComponentOptions)) : undefined,
    }
  }
}

interface SerializeOptions {
  withWorkspace?: boolean
  withComponents?: boolean
  withCategories?: boolean
  withInputs?: boolean
  withOutputs?: boolean
}

export interface RegistryCollectionObject {
  name: string
  title: string
  icon: string
  summary: string
  description: string
  isPublic: boolean
  updatedAt: string
  createdAt: string
  workspace?: WorkspaceObject
  categories?: RegistryCategoryObject[]
  components?: RegistryComponentObject[]
}
