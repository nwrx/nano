import { BaseEntity } from '@unserved/server'
import { Column, Entity } from 'typeorm'

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
export class RegistryCategory extends BaseEntity {

  /**
   * The name of the category.
   *
   * @example 'storage'
   */
  @Column('varchar', { length: 255, unique: true })
  name: string

  /**
   * The title of the category.
   *
   * @example 'Storage'
   */
  @Column('varchar', { length: 255 })
  title: string

  /**
   * The icon of the category.
   *
   * @example 'https://example.com/icon.png'
   */
  @Column('varchar', { length: 255, default: '' })
  icon: string

  /**
   * The description of the category.
   *
   * @example 'This category is used to classify components that are used to store data.'
   */
  @Column('text', { default: '' })
  description: string

  /**
   * The color of the category.
   *
   * @example '#888888'
   */
  @Column('varchar', { length: 255, default: '#888888' })
  color: string
}
