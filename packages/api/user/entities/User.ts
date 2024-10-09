import { BaseEntity, transformerDate } from '@unserved/server'
import { UUID } from 'node:crypto'
import { Column, Entity, OneToMany, OneToOne } from 'typeorm'
import { UserPassword } from './UserPassword'
import { UserProfile, UserProfileObject } from './UserProfile'
import { UserSession, UserSessionObject } from './UserSession'

/**
 * A user of the application. It can be a customer, an employee, an administrator, etc.
 * Each user has a unique email address and a password. The password is hashed before
 * being stored in the database.
 *
 * The user can have one or more roles. The role is used to determine what the user can
 * do in the application. For example, a customer can only view the products and place
 * orders. An employee can view the products, place orders, and manage the inventory.
 * An administrator can do everything.
 */
@Entity({ name: 'User' })
export class User extends BaseEntity {

  /**
   * Flag to check if the user is the super-administrator. It is used to allow the user
   * to access the application without any restrictions. It also prevents the user from
   * being disabled or deleted.
   */
  @Column('boolean', { nullable: true, unique: true })
  isSuperAdministrator?: boolean

  /**
   * The email address of the user. It is unique and used to send notifications and
   * reset the password. It is also used to verify the user's identity.
   *
   * @example 'john.doe@acme.com'
   */
  @Column('varchar', { unique: true, length: 255 })
  email: string

  /**
   * Email or username address of the user. It is unique and used to login.
   */
  @Column('varchar', { unique: true, length: 255 })
  username: string

  /**
   * Date at which the user was disabled. It is used to determine if the user can access
   * the application or not.
   *
   * @example Date { ... }
   */
  @Column('varchar', { length: 255, nullable: true, transformer: transformerDate })
  disabledAt?: Date | null

  /**
   * Date at which the user was verified. It is used to determine if the user has
   * verified their email address or phone number.
   *
   * @example Date { ... }
   */
  @Column('varchar', { length: 255, nullable: true, transformer: transformerDate })
  verifiedAt?: Date | null

  /**
   * The list of passwords associated with the user. It is used to store the history of all passwords of the user.
   *
   * @example [UserPassword { ... }]
   */
  @OneToMany(() => UserPassword, password => password.user, { cascade: true })
  passwords?: UserPassword[]

  /**
   * The list of sessions associated with the user. It is used to determine the devices
   * and browsers that the user is using to access the application.
   *
   * @example [UserSession { ... }]
   */
  @OneToMany(() => UserSession, session => session.user, { cascade: true })
  sessions?: UserSession[]

  /**
   * The list of profiles associated with the user. It is used to store additional information about the user.
   *
   * @example UserProfile { ... }
   */
  @OneToOne(() => UserProfile, profile => profile.user, { nullable: false, cascade: true })
  profile?: UserProfile

  /**
   * Get the most recent session used by the user. It is used to determine the last time
   * the user was seen in the application. It is also used to determine if the user is
   * currently online or offline.
   *
   * @returns The most recent session.
   * @example UserSession { ... }
   */
  get lastSession(): UserSession | undefined {
    if (!this.sessions) return undefined
    return this.sessions
      .sort((a, b) => (a.lastUsedAt > b.lastUsedAt ? -1 : 1))
      .shift()
  }

  /**
   * Return a copy if the exposed properties of the user. It is used to send the user
   * data to the client without exposing sensitive information.
   *
   * @param options The options to serialize the user with.
   * @returns The user data.
   */
  serialize(options: SerializeOptions = {}): UserObject {
    return {

      // Public properties.
      ...this.profile?.serialize(),
      username: this.username,
      displayName: this.profile?.displayName ?? this.username,
      avatarUrl: `/api/users/${this.username}/avatar`,

      // Protected properties.
      id: options.withProtected ? this.id : undefined,
      email: options.withProtected ? this.email : undefined,
      verifiedAt: options.withProtected ? this.verifiedAt?.toISOString() : undefined,
      disabledAt: options.withProtected ? this.disabledAt?.toISOString() : undefined,
      createdAt: options.withProtected ? this.createdAt?.toISOString() : undefined,
      updatedAt: options.withProtected ? this.updatedAt?.toISOString() : undefined,

      // Sessions.
      lastSeenAt: this.lastSession?.lastUsedAt?.toISOString(),
      sessions: options.withSessions
        ? this.sessions
          ?.filter(session => session.expiresAt > new Date())
          .filter(session => !session.deletedAt)
          .map(session => session.serialize())
        : undefined,
    }
  }
}

interface SerializeOptions {
  withProtected?: boolean
  withSessions?: boolean
}

export interface UserObject extends UserProfileObject {
  username: string
  displayName: string
  avatarUrl: string

  id?: UUID
  email?: string
  verifiedAt?: string
  disabledAt?: string
  createdAt?: string
  updatedAt?: string

  lastSeenAt?: string
  sessions?: UserSessionObject[]
}
