import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { PasswordOptions } from '../utils'
import { User } from './User'

/**
 * A user password entity that stores the history of all passwords of the users.
 */
@Entity({ name: 'UserPassword' })
export class UserPassword extends BaseEntity {

  /**
   * The hashed password of the user.
   */
  @Column('varchar', { length: 255 })
  password: string

  /**
   * The options used to hash the current password of the user.
   */
  @Column('text', { transformer: transformerJson, nullable: true })
  passwordOptions?: PasswordOptions

  /**
   * The user associated with this password.
   */
  @JoinColumn()
  @ManyToOne(() => User, user => user.passwords)
  user: User
}
