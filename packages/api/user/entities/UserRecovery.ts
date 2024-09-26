import { BaseEntity, transformerDate } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './User'

/**
 * A `UserRecovery` is a special entity used to recover the password of a user.
 * It contains a special token that is used to reset the password of the user. The token
 * is sent to the user by email and is used to verify the identity of the user.
 */
@Entity('UserRecovery')
export class UserRecovery extends BaseEntity {

  /**
   * The user associated with the recovery request. It is used to determine the user
   * that requested the password recovery.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User)
  user: User

  /**
   * The address of the session. It is used to bind the session to a specific device.
   *
   * @example '192.168.1.1'
   */
  @Column('varchar', { length: 255 })
  address: string

  /**
   * The user agent of the session. It is used to determine the device and browser
   * that the user is using to access the application.
   *
   * @example 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
   */
  @Column('varchar', { length: 255 })
  userAgent: string

  /**
   * The date at which the recovery request was created. It is used to determine the
   * time at which the user requested the password recovery.
   *
   * @example Date { ... }
   */
  @Column('varchar', { length: 255, transformer: transformerDate })
  expiresAt: Date

  /**
   * The date at which the recovery request was consumed. It is used to determine if the
   * recovery request was used or not and disable it after so it can't be used again.
   *
   * @example Date { ... }
   */
  @Column('varchar', { length: 255, nullable: true, transformer: transformerDate })
  consumedAt?: Date
}
