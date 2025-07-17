import { IconifyInfo } from '@iconify/types'
import { BaseEntity, transformerDate, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Icon } from '../../icon'
import { User, UserObject } from '../../user'

export type IconCollectionStatus =
  | 'Error'
  | 'Installed'
  | 'Installing'
  | 'NotInstalled'
  | 'Outdated'

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
   * The title of the set. It is used to display the name of the set in the UI
   * and allow the users to search the icons by their sets.
   */
  @Column('varchar', { length: 255 })
  title: string

  /**
   * The version of the set. It is used to display the version of the set in the UI
   * and allow the users to search the icons by their sets.
   */
  @Column('varchar', { length: 50 })
  version: string

  /**
   * The status of the set. It is used to display the status of the set in the UI
   * and allow the users to search the icons by their sets.
   */
  @Column('varchar', { length: 50, default: 'NotInstalled' })
  status: IconCollectionStatus

  /**
   * The name of the author of the set. It is used to display the name of the author
   * in the UI and allow the users to search the icons by their sets.
   */
  @Column('varchar', { length: 255 })
  author: string

  /**
   * The url of the author of the set. It is used to display the url of the author
   * in the UI and allow the users to search the icons by their sets.
   */
  @Column('varchar', { length: 255, nullable: true })
  authorUrl?: string

  /**
   * The licence of the set. It is used to display the licence of the set in the UI
   * and allow the users to search the icons by their sets.
   */
  @Column('varchar', { length: 255 })
  license: string

  /**
   * The url of the licence of the set. It is used to display the url of the licence
   * in the UI and allow the users to search the icons by their sets.
   */
  @Column('varchar', { length: 255, nullable: true })
  licenseUrl?: string

  /**
   * The SPDX identifier of the licence of the set. It is used to display the SPDX identifier
   * of the licence in the UI and allow the users to search the icons by their sets.
   */
  @Column('varchar', { length: 50, nullable: true })
  licenseSpdx?: string

  /**
   * The metadata of the set. It is used to provide additional information about the set
   * such as the author, the license, the category, the height, and the palette.
   */
  @Column('text', { transformer: transformerJson })
  metadata: IconifyInfo

  /**
   * The icons of the set. It is used to link the set to the icons and allow the users
   * to search the icons by their sets.
   *
   * @example [Icon {...}, Icon {...}]
   */
  @OneToMany(() => Icon, icon => icon.collection, { cascade: true })
  icons: Icon[]

  /**
   * The user responsible for registering the MCP manager. This user must be
   * a super administrator in order to register a MCP manager. This is used
   * to ensure that only authorized users can register MCP managers.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy?: User

  /**
   * The user that updated the MCP manager. This is used to track who made
   * changes to the MCP manager and is useful for auditing purposes. This field
   * is optional and may be undefined if the MCP manager has not been updated
   * since it was created.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updatedBy?: null | User

  /**
   * The date at which the MCP manager was disabled. When defined, this
   * indicates that the MCP manager is no longer active and should not be
   * used to manage MCP resources. This is used to disable MCP managers without
   * deleting them from the database.
   */
  @Column('varchar', { transformer: transformerDate, nullable: true })
  disabledAt: Date | null

  /**
   * The user that disabled the MCP manager. This is used to track who
   * disabled the MCP manager and is useful for auditing purposes. This field
   * is optional and may be undefined if the MCP manager has not been disabled
   * since it was created.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  disabledBy?: null | User

  /**
   * @returns The serialized object of the icon collection.
   */
  serialize(): IconCollectionObject {
    return {
      name: this.name,
      title: this.title,
      version: this.version,
      status: this.status,
      license: this.license,
      licenseUrl: this.licenseUrl,
      licenseSpdx: this.licenseSpdx,
      author: this.author,
      authorUrl: this.authorUrl,

      // --- Metadata
      createdAt: this.createdAt.toISOString(),
      createdBy: this.createdBy ? this.createdBy.serialize() : undefined,
      updatedAt: this.updatedAt.toISOString(),
      updatedBy: this.updatedBy ? this.updatedBy.serialize() : undefined,
      disabledAt: this.disabledAt?.toISOString(),
      disabledBy: this.disabledBy ? this.disabledBy.serialize() : undefined,
    }
  }
}

export interface IconCollectionObject {
  name: string
  title: string
  version: string
  license?: string
  licenseUrl?: string
  licenseSpdx?: string
  author: string
  authorUrl?: string
  status: IconCollectionStatus

  // --- Metadata
  createdAt?: string
  createdBy?: UserObject
  updatedAt?: string
  updatedBy?: UserObject
  disabledAt?: string
  disabledBy?: UserObject
}
