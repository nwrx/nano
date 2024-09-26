import { BaseEntity } from '@unserved/server'
import { Column, Entity, OneToMany } from 'typeorm'
import { User, UserObject } from '../../user'
import { WorkspaceAssignment } from './WorkspaceAssignment'
import { WorkspaceProject, WorkspaceProjectObject } from './WorkspaceProject'

/**
 * A `Workspace` is a collection of projects and flows that are grouped together. It allows
 * us to organize the projects and flows that are part of the same workspace or to group
 * the projects and flows that are related to the same topic.
 */
@Entity({ name: 'Workspace' })
export class Workspace extends BaseEntity {

  /**
   * The name of the workspace. The name is used to identify the workspace in the database
   * and to generate the URL of the workspace.
   *
   * @example 'my-workspace'
   */
  @Column('varchar', { length: 255, unique: true })
  name: string

  /**
   * Flag to declare the workspace as public. If the workspace is public, it can be viewed
   * by anyone without the need to authenticate. By default, the workspace is private unless
   * the `isPublic` flag is set to `true`.
   *
   * @example false
   */
  @Column('boolean', { default: false })
  isPublic: boolean

  /**
   * The projects that are part of the workspace.
   *
   * @example [Project, Project, Project]
   */
  @OneToMany(() => WorkspaceProject, project => project.workspace, { cascade: true, onDelete: 'CASCADE' })
  projects: WorkspaceProject[]

  /**
   * The assignments of the workspace to the users.
   *
   * @example [WorkspaceAssignment, WorkspaceAssignment, WorkspaceAssignment]
   */
  @OneToMany(() => WorkspaceAssignment, assignment => assignment.workspace, { cascade: true, onDelete: 'CASCADE' })
  assignments: WorkspaceAssignment[]

  /**
   * Get the assignments grouped by users. The function will return an array of objects
   * where each object contains the user and a list of permissions assigned to the user.
   *
   * @returns The assignments grouped by users.
   */
  get assignmentsByUser(): WorkspaceAssignmentsByUser[] | undefined {
    if (!this.assignments) return

    // --- Group the assignments by user.
    const result: WorkspaceAssignmentsByUser[] = []
    for (const assignment of this.assignments) {
      if (!assignment.user) continue
      const user = assignment.user
      const permissions = assignment.permission
      const index = result.findIndex(item => item.user.username === user.username)
      if (index === -1) result.push({ user, permissions: [permissions] })
      else result[index].permissions.push(permissions)
    }

    // --- Return the assignments.
    return result
  }

  /**
   * @returns The object representation of the workspace.
   */
  serialize(): WorkspaceObject {
    return {
      id: this.id,
      name: this.name,
      isPublic: this.isPublic,
      projects: this.projects?.map(project => project.serialize()),
      assignments: this.assignmentsByUser?.map(({ user, permissions }) => ({
        user: user.serialize(),
        permissions,
      })),
    }
  }
}

export interface WorkspaceAssignmentsByUser {
  user: User
  permissions: string[]
}

export interface WorkspaceAssignmentsByUserObject {
  user: UserObject
  permissions: string[]
}

export interface WorkspaceObject {
  id: string
  name: string
  isPublic: boolean
  projects?: WorkspaceProjectObject[]
  assignments?: WorkspaceAssignmentsByUserObject[]
}
