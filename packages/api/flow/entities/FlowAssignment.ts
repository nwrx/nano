import type { FlowPermission } from '../utils'
import { BaseEntity } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { User } from '../../user'
import { Flow } from './Flow'

/**
 * A `FlowAssignment` is used to assign a flow to a user. The assignment
 * is used to give the user access to the flow and to determine their
 * permissions for viewing, editing, or deploying the flow.
 */
@Entity({ name: 'FlowAssignment' })
@Unique(['user', 'flow', 'permission'])
export class FlowAssignment extends BaseEntity {

  /**
   * The user that is assigned to the flow.
   */
  @JoinColumn()
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  user?: User

  /**
   * The flow that is assigned to the user.
   */
  @JoinColumn()
  @ManyToOne(() => Flow, { onDelete: 'CASCADE', nullable: false })
  flow?: Flow

  /**
   * The permission that the user has on the flow assigned.
   *
   * @example 'Read'
   */
  @Column('varchar', { length: 32 })
  permission: FlowPermission
}
