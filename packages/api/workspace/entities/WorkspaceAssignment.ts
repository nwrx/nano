import type { WorkspacePermission } from '../utils'
import { BaseEntity } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { User } from '../../user'
import { Workspace } from './Workspace'

/**
 * A `UserWorkspace` is a one-to-one relationship between a user and a workspace. It allows
 * us to assign an owner to a workspace and to give the user access to the projects and flows
 * that are part of the workspace.
 *
 * @example UserWorkspace { ... }
 */
@Entity({ name: 'WorkspaceAssignment' })
@Unique('WorkspaceAssignment_Unique', ['user', 'workspace', 'permission'])
export class WorkspaceAssignment extends BaseEntity {

  /**
   * The user that is assigned to the workspace.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { onDelete: 'RESTRICT', nullable: false })
  user?: User

  /**
   * The workspace that is assigned to the user.
   *
   * @example Workspace { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Workspace, workspace => workspace.assignments, { onDelete: 'RESTRICT', nullable: false })
  workspace?: Workspace

  /**
   * The permission that the user has for the workspace.
   *
   * @example 'Owner'
   */
  @Column('varchar', { length: 32 })
  permission: WorkspacePermission
}
