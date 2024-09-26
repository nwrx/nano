import { BaseEntity, transformerDate, transformerJson } from '@unserved/server'
import { Column, Entity, OneToMany, OneToOne } from 'typeorm'
import { createPassword, PasswordOptions } from '../utils'
import { UserPassword } from './UserPassword'
import { UserProfile } from './UserProfile'
import { UserSession } from './UserSession'

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
  @Column('varchar', { unique: true, length: 255, nullable: true })
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
  disabledAt?: Date

  /**
   * Date at which the user was verified. It is used to determine if the user has
   * verified their email address or phone number.
   *
   * @example Date { ... }
   */
  @Column('varchar', { length: 255, nullable: true, transformer: transformerDate })
  verifiedAt?: Date

  /**
   * The list of sessions associated with the user. It is used to determine the devices
   * and browsers that the user is using to access the application.
   *
   * @example [UserSession { ... }]
   */
  @OneToMany(() => UserSession, session => session.user)
  sessions?: UserSession[]

  /**
   * The list of profiles associated with the user. It is used to store additional information about the user.
   *
   * @example [UserProfile { ... }]
   */
  @OneToOne(() => UserProfile, profile => profile.user)
  profile?: UserProfile

  /**
   * The list of passwords associated with the user. It is used to store the history of all passwords of the user.
   *
   * @example [UserPassword { ... }]
   */
  @OneToMany(() => UserPassword, password => password.user)
  passwords?: UserPassword[]

  /**
   * Return a copy if the exposed properties of the user. It is used to send the user
   * data to the client without exposing sensitive information.
   *
   * @returns The user data.
   */
  serialize(): UserObject {
    return {
      username: this.username,
    }
  }
}

/**
 * The user object returned to the client. It is used to send the user data to the client
 * without exposing sensitive information.
 */
export interface UserObject {
  username: string
}
