import { BaseEntity, transformerDate } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { User } from '../../user'
import { WorkspaceAssignment } from './WorkspaceAssignment'

/**
 * A `Workspace` is a collection of projects and flows that are grouped together. It allows
 * us to organize the projects and flows that are part of the same workspace or to group
 * the projects and flows that are related to the same topic.
 */
@Entity({ name: 'Workspace' })
@Index(['name', 'deletedAt'], { unique: true })
export class Workspace extends BaseEntity {

  /**
   * The name of the workspace. The name is used to identify the workspace in the database
   * and to generate the URL of the workspace.
   *
   * @example 'my-workspace'
   */
  @Column('varchar')
  name: string

  /**
   * Flag to declare the workspace as public. If the workspace is public, it can be viewed
   * by anyone without the need to authenticate. By default, the workspace is private unless
   * the `isPublic` flag is set to `true`.
   *
   * @example false
   */
  @Column('boolean')
  isPublic = false

  /**
   * Date at which the workspace was archived. If the workspace is archived, it can no longer
   * be edited or viewed by the users. The workspace can be restored by the administrators or
   * owners of the workspace.
   *
   * @example Date { ... }
   */
  @Column('varchar', { nullable: true, transformer: transformerDate })
  archivedAt: Date | null

  /**
   * The user who created the workspace. Note that this user is not necessarily the owner of
   * the workspace. This field has no impact on the permissions of the workspace.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy: undefined | User

  /**
   * The assignments of the workspace to the users.
   *
   * @example [WorkspaceAssignment, WorkspaceAssignment, WorkspaceAssignment]
   */
  @OneToMany(() => WorkspaceAssignment, assignment => assignment.workspace, { cascade: true })
  assignments: undefined | WorkspaceAssignment[]

  /**
   * @returns The object representation of the workspace.
   */
  serialize(): WorkspaceObject {
    return {
      id: this.id,
      name: this.name,
      isPublic: this.isPublic,
    }
  }
}

export interface WorkspaceObject {
  id: string
  name: string
  isPublic: boolean
}
