import type { VaultPermission } from '../utils'
import { BaseEntity } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { Project } from '../../project'
import { User } from '../../user'
import { Vault } from './Vault'

@Entity({ name: 'VaultProjectAssignment' })
@Unique(['vault', 'project', 'permission'])
export class VaultProjectAssignment extends BaseEntity {

  /**
   * The vault that is assigned to the project.
   */
  @JoinColumn()
  @ManyToOne(() => Vault, { nullable: false, onDelete: 'CASCADE' })
  vault: Vault

  /**
   * The project that the vault is assigned to. Users with write permission
   * on this project will be able to access the vault's variables.
   */
  @JoinColumn()
  @ManyToOne(() => Project, { nullable: false, onDelete: 'CASCADE' })
  project: Project

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
