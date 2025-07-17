import type { McpPoolPermission } from '../utils/assertMcpPoolPermission'
import { BaseEntity } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { Project } from '../../project'
import { User } from '../../user'
import { McpPool } from './McpPool'

@Entity({ name: 'McpPoolProjectAssignment' })
@Index(['pool', 'project', 'permission', 'deletedAt'], { unique: true })
export class McpPoolProjectAssignment extends BaseEntity {

  /**
   * The MCP pool that is assigned to the project.
   */
  @JoinColumn()
  @ManyToOne(() => McpPool, { nullable: false, onDelete: 'CASCADE' })
  pool: McpPool

  /**
   * The project that the pool is assigned to. Users with appropriate permission
   * on this project will be able to access the pool's servers.
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
  permission: McpPoolPermission
}
