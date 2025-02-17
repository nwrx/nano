import { BaseEntity } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { Flow } from '../../flow'
import { User } from '../../user'
import { VaultPermission } from '../utils'
import { Vault } from './Vault'

@Entity({ name: 'VaultFlowAssignment' })
@Unique(['vault', 'flow', 'permission'])
export class VaultFlowAssignment extends BaseEntity {

  /**
   * The vault that is assigned to the flow.
   */
  @JoinColumn()
  @ManyToOne(() => Vault, { nullable: false, onDelete: 'CASCADE' })
  vault: Vault

  /**
   * The flow that the vault is assigned to. Users with write permission
   * on this flow will be able to access the vault's variables.
   */
  @JoinColumn()
  @ManyToOne(() => Flow, { nullable: false, onDelete: 'CASCADE' })
  flow: Flow

  /**
   * The user that created the assignment.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  createdBy: User

  /**
   * The permission level for this assignment.
   *
   * @example 'Read'
   */
  @Column('varchar', { length: 255 })
  permission: VaultPermission
}
