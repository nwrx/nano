import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
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
  @OneToOne(() => User, user => user.profile)
  user: User

  /**
   * The display name of the user. It is used to show the user's name in the
   * application. It can be the first name, the last name, or a combination of both.
   */
  @Column('varchar', { length: 255 })
  displayName: string

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
