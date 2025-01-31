import { BaseEntity } from '@unserved/server'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { User } from './User'

/**
 * A user profile entity that contains additional information about the user.
 */
@Entity({ name: 'UserProfile' })
export class UserProfile extends BaseEntity {

  /**
   * The display name of the user. It is used to show the user's name in the
   * application. It can be the first name, the last name, or a combination of both.
   */
  @Column('varchar', { length: 255, nullable: true })
  displayName?: string

  /**
   * A short biography of the user.
   */
  @Column('text', { nullable: true })
  bio?: string

  /**
   * The user's personal or professional website.
   */
  @Column('varchar', { length: 255, nullable: true })
  website?: string

  /**
   * The user's social media links.
   */
  @Column('json', { nullable: true })
  socials?: Record<string, string>

  /**
   * The user associated with this profile.
   */
  @JoinColumn()
  @OneToOne(() => User, user => user.profile)
  user: User
}
