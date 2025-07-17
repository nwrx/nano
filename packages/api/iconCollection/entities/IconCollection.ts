import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, OneToMany } from 'typeorm'
import { Icon } from '../../icon'

export interface IconCollectionMetadata {
  name: string
  total: number
  version: string
  author: {
    name: string
    url?: string
  }
  license: {
    title: string
    spdx?: string
    url?: string
  }
  samples: string[]
  height: number
  displayHeight: number
  category: string
  tags: string[]
  palette: boolean
}

/**
 * The set of icons. It is used to group the icons by their sets and allow the users
 * to search the icons by their sets.
 */
@Entity({ name: 'IconCollection' })
export class IconCollection extends BaseEntity {

  /**
   * The slug of the set. It is used to identify the set in the URL and allow the users
   * to search the icons by their sets.
   *
   * @example 'mdi'
   */
  @Column('varchar', { length: 255, unique: true })
  name: string

  /**
   * The metadata of the set. It is used to provide additional information about the set
   * such as the author, the license, the category, the height, and the palette.
   */
  @Column('text', { transformer: transformerJson })
  metadata: IconCollectionMetadata

  /**
   * The icons of the set. It is used to link the set to the icons and allow the users
   * to search the icons by their sets.
   *
   * @example [Icon {...}, Icon {...}]
   */
  @OneToMany(() => Icon, icon => icon.collection, { cascade: true })
  icons: Icon[]
}
