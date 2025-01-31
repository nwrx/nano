import { BaseEntity, transformerDate } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { User } from './User'

/**
 * A `UserRecovery` is a special entity used to recover the password of a user.
 * It contains a special token that is used to reset the password of the user. The token
 * is sent to the user by email and is used to verify the identity of the user.
 */
@Entity('UserRecovery')
@Unique('UserRecovery_user', ['user', 'consumedAt'])
export class UserRecovery extends BaseEntity {

  /**
   * The user associated with the recovery request. It is used to determine the user
   * that requested the password recovery.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user?: User

  /**
   * The date at which the recovery request was created. It is used to determine the
   * time at which the user requested the password recovery.
   *
   * @example Date { ... }
   */
  @Column('varchar', { length: 255, transformer: transformerDate })
  expiredAt: Date

  /**
   * The date at which the recovery request was consumed. It is used to determine if the
   * recovery request was used or not and disable it after so it can't be used again.
   *
   * @example Date { ... }
   */
  @Column('varchar', { length: 255, nullable: true, transformer: transformerDate })
  consumedAt?: Date | null
}
