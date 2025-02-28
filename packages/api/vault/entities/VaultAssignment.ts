import type { VaultPermission } from '../utils'
import { BaseEntity } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { User } from '../../user'
import { Vault } from './Vault'

@Entity({ name: 'VaultAssignment' })
@Unique(['vault', 'user', 'permission'])
export class VaultAssignment extends BaseEntity {

  /**
   * The vault that is assigned to the user. The user, depending on the
   * assigned permission, can access the vault and its values.
   *
   * @example Vault { name: 'my-vault', ... }
   */
  @JoinColumn()
  @ManyToOne(() => Vault, { nullable: false })
  vault: Vault

  /**
   * The user that the variable is assigned to. The variable can be used
   * within the user to store data that is required by the user.
   *
   * @example User { name: 'my-user', ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  user: User

  /**
   * The user that is responsible for the assignment. This user can be
   * used to track who made the assignment.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy: User

  /**
   * The permission level for this assignment.
   *
   * @example 'Owner'
   */
  @Column('varchar', { length: 255 })
  permission: VaultPermission
}
