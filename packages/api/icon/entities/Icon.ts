import { BaseEntity } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IconCollection } from '../../iconCollection'
import { StorageFile } from '../../storage'

/**
 * Icons are used to embellish the website content and allow the users to recognize
 * the content by its icon. The icons data are stored as assets in the asset module.
 */
@Entity({ name: 'Icon' })
export class Icon extends BaseEntity {

  /**
   * The name of the icon. It is a string that represents the icon in the iconify
   * CDN and is made up of the icon collection and the icon name separated by a colon.
   *
   * @example 'mdi:web'
   */
  @Column('varchar', { length: 255, unique: true })
  name: string

  /**
   * Description of the icon. It is used to provide additional information about the icon
   * such as its purpose or usage. Can be used to search the icons by their description.
   */
  @Column('text', { nullable: true })
  description: null | string | undefined

  /**
   * If `true`, the icon is used as a sample when presenting the icons sets.
   *
   * @default false
   */
  @Column('boolean', { default: false })
  isSample: boolean

  /**
   * The file that contains the SVG representation of the icon.
   * It is used to render the icon in the website content.
   */
  @JoinColumn()
  @ManyToOne(() => StorageFile, { nullable: true })
  file: null | StorageFile | undefined

  /**
   * The collection from which the icon is taken. It is used to group the icons by their
   * sets and allow the users to search the icons by their sets.
   */
  @JoinColumn()
  @ManyToOne(() => IconCollection, collection => collection.icons, { onDelete: 'CASCADE' })
  collection: IconCollection

  /**
   * @returns The string representation of the icon.
   */
  serialize(): string {
    return this.name
  }
}
