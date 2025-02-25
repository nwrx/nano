import type { RegistryCategoryType } from '../utils'
import { BaseEntity } from '@unserved/server'
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm'
import { RegistryComponent, RegistryComponentObject } from './RegistryComponent'

/**
 * A `RegistryCategory` is a category that is used to classify the components, templates
 * and other items in the registry. It should be a succinct and descriptive name that
 * broadly represents the use case and purpose of the items contained within the category.
 *
 * For example, the `storage` category could be used to classify components that are used
 * to store data in a database or remote storage service like AWS S3.
 *
 * Note that the categories are created on first boot of the application and can only be
 * updated by the administrator. This is to ensure that the categories are consistent and
 * stable during the lifetime of the application.
 */
@Entity({ name: 'RegistryCategory' })
@Index(['name', 'deletedAt'], { unique: true })
export class RegistryCategory extends BaseEntity {

  /**
   * The name of the category.
   *
   * @example 'storage'
   */
  @Column('varchar')
  name: string

  /**
   * The type of the category. This allows for more granular classification of
   * the components in the registry.
   */
  @Column('varchar')
  type: RegistryCategoryType

  /**
   * The title of the category.
   *
   * @example 'Storage'
   */
  @Column('varchar')
  title: string

  /**
   * The icon of the category.
   *
   * @example 'https://example.com/icon.png'
   */
  @Column('varchar')
  icon = ''

  /**
   * The description of the category.
   *
   * @example 'This category is used to classify components that are used to store data.'
   */
  @Column('text')
  description = ''

  /**
   * The color of the category.
   *
   * @example '#888888'
   */
  @Column('varchar')
  color = '#888888'

  /**
   * The components that belong to this category.
   *
   * @example [RegistryComponent, RegistryComponent, ...]
   */
  @JoinTable({ name: 'RegistryComponentCategory' })
  @ManyToMany(() => RegistryComponent, component => component.categories)
  components: RegistryComponent[] | undefined

  /**
   * @param options The properties to include in the result.
   * @returns The serialized representation of the category.
   */
  serialize(options: SerializeOptions = {}): RegistryCategoryObject {
    const { withComponents, ...serializeComponentsOptions } = options
    return {
      name: this.name,
      type: this.type,
      title: this.title,
      icon: this.icon,
      description: this.description,
      color: this.color,
      components: withComponents ? this.components?.map(component => component.serialize(serializeComponentsOptions)) : undefined,
    }
  }
}

interface SerializeOptions {
  withComponents?: boolean
  withInputs?: boolean
  withOutputs?: boolean
  withCollection?: boolean
  withWorkspace?: boolean
}

export interface RegistryCategoryObject {
  name: string
  type: RegistryCategoryType
  title: string
  icon: string
  description: string
  color: string
  components?: RegistryComponentObject[]
}
