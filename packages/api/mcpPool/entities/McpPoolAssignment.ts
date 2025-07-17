import type { McpPoolPermission } from '../utils'
import { BaseEntity } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { User } from '../../user'
import { McpPool } from './McpPool'

@Entity({ name: 'McpPoolAssignment' })
@Index(['pool', 'user', 'permission', 'deletedAt'], { unique: true })
export class McpPoolAssignment extends BaseEntity {

  /**
   * The MCP pool that is assigned to the user. The user, depending on the
   * assigned permission, can access the pool and manage its servers.
   *
   * @example McpPool { name: 'production-pool', ... }
   */
  @JoinColumn()
  @ManyToOne(() => McpPool, { nullable: false, onDelete: 'CASCADE' })
  pool?: McpPool

  /**
   * The user that the pool is assigned to. The user can manage
   * servers within the pool based on their permission level.
   *
   * @example User { name: 'john-doe', ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  user?: User

  /**
   * The user that is responsible for the assignment. This user can be
   * used to track who made the assignment.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  createdBy?: User

  /**
   * The permission level for this assignment.
   *
   * @example 'Owner'
   */
  @Column('varchar', { length: 255 })
  permission: McpPoolPermission
}
