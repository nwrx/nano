import type { PasswordOptions } from '../utils'
import { BaseEntity, transformerDate, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './User'

/**
 * A user password entity that stores the history of all passwords of the users.
 */
@Entity({ name: 'UserPassword' })
export class UserPassword extends BaseEntity {

  /**
   * The user associated with this password.
   */
  @JoinColumn()
  @ManyToOne(() => User, user => user.passwords)
  user: User

  /**
   * The hashed password of the user.
   */
  @Column('varchar', { length: 255 })
  hash: string

  /**
   * The options used to hash the current password of the user.
   */
  @Column('text', { transformer: transformerJson, nullable: true })
  options: PasswordOptions

  /**
   * The expiration date of the password. It is used to determine when the password
   * will expire and the user will have to change it.
   */
  @Column('varchar', { length: 255, nullable: true, transformer: transformerDate })
  expiredAt?: Date
}
