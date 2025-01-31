import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { StorageFile } from '../../storage'
import { User } from './User'

/**
 * A user profile entity that contains additional information about the user.
 */
@Entity({ name: 'UserProfile' })
export class UserProfile extends BaseEntity {

  /**
   * The user associated with this profile.
   */
  @JoinColumn()
  @OneToOne(() => User, user => user.profile, { nullable: false, onDelete: 'CASCADE' })
  user: User

  /**
   * The display name of the user. It is used to show the user's name in the
   * application. It can be the first name, the last name, or a combination of both.
   */
  @Column('varchar', { length: 255 })
  displayName: string

  /**
   * The avatar of the user. It is used to show the user's profile picture in the
   * application. It can be an image or a placeholder if the user has not set an avatar.
   */
  @JoinColumn()
  @ManyToOne(() => StorageFile, { cascade: true, nullable: true, onDelete: 'SET NULL' })
  avatar?: StorageFile

  /**
   * A short biography of the user.
   */
  @Column('text', { default: '' })
  biography?: string

  /**
   * The user's personal or professional website.
   */
  @Column('varchar', { length: 255, default: '' })
  website?: string

  /**
   * The company where the user works.
   *
   * @example 'Google'
   */
  @Column('varchar', { length: 255, default: '' })
  company?: string

  /**
   * The user's social media links.
   */
  @Column('text', { transformer: transformerJson, default: '[]' })
  socials?: string[]

  /**
   * @returns The serialized profile object.
   */
  serialize(): UserProfileObject {
    return {
      displayName: this.displayName,
      biography: this.biography,
      company: this.company,
      website: this.website,
      socials: this.socials,
    }
  }
}

export interface UserProfileObject {
  displayName?: string
  biography?: string
  company?: string
  website?: string
  socials?: string[]
}
