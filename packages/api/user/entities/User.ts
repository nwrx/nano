import { BaseEntity, transformerDate } from '@unserved/server'
import { Column, Entity, Index, OneToOne } from 'typeorm'
import { UserProfile, UserProfileObject } from './UserProfile'

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
@Index(['email', 'deletedAt'], { unique: true })
@Index(['username', 'deletedAt'], { unique: true })
export class User extends BaseEntity {

  /**
   * Flag to check if the user is the super-administrator. It is used to allow the user
   * to access the application without any restrictions. It also prevents the user from
   * being disabled or deleted.
   */
  @Column('boolean', { nullable: true, unique: true })
  isSuperAdministrator: boolean | null

  /**
   * The email address of the user. It is unique and used to send notifications and
   * reset the password. It is also used to verify the user's identity.
   *
   * @example 'john.doe@acme.com'
   */
  @Column('varchar')
  email: string

  /**
   * Email or username address of the user. It is unique and used to login.
   */
  @Column('varchar')
  username: string

  /**
   * Date at which the user was disabled. It is used to determine if the user can access
   * the application or not.
   *
   * @example Date { ... }
   */
  @Column('varchar', { nullable: true, transformer: transformerDate })
  disabledAt: Date | null

  /**
   * Date at which the user was verified. It is used to determine if the user has
   * verified their email address or phone number.
   *
   * @example Date { ... }
   */
  @Column('varchar', { nullable: true, transformer: transformerDate })
  verifiedAt: Date | null

  /**
   * The list of profiles associated with the user. It is used to store additional information about the user.
   *
   * @example UserProfile { ... }
   */
  @OneToOne(() => UserProfile, profile => profile.user, { nullable: false, cascade: true })
  profile: undefined | UserProfile

  /**
   * Return a copy if the exposed properties of the user. It is used to send the user
   * data to the client without exposing sensitive information.
   *
   * @param options The options to serialize the user with.
   * @returns The user data.
   */
  serialize(options: SerializeOptions = {}): UserObject {
    return {
      ...this.profile?.serialize(),
      username: this.username,
      email: options.withProtected ? this.email : undefined,
      verifiedAt: options.withProtected ? this.verifiedAt?.toISOString() : undefined,
      disabledAt: options.withProtected ? this.disabledAt?.toISOString() : undefined,
      createdAt: options.withProtected ? this.createdAt?.toISOString() : undefined,
      updatedAt: options.withProtected ? this.updatedAt?.toISOString() : undefined,
      deletedAt: options.withProtected ? this.deletedAt?.toISOString() : undefined,
    }
  }
}

interface SerializeOptions {
  withProtected?: boolean
}

export interface UserObject extends Partial<UserProfileObject> {
  username: string
  email?: string
  verifiedAt?: string
  disabledAt?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}
