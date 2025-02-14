import { BaseEntity, transformerDate } from '@unserved/server'
import { Column, Entity, OneToMany } from 'typeorm'
import { Project, ProjectObject } from '../../project'
import { UserObject } from '../../user'
import { getWorkspaceUserAssignments } from '../utils'
import { WorkspaceAssignment } from './WorkspaceAssignment'

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
   * Flag to indicate the workspace is the main workspace of a user and therefore can not be
   * deleted unless the user is deleted.
   *
   * @example false
   */
  @Column('boolean', { default: false })
  isUserWorkspace: boolean

  /**
   * Date at which the workspace was archived. If the workspace is archived, it can no longer
   * be edited or viewed by the users. The workspace can be restored by the administrators or
   * owners of the workspace.
   *
   * @example Date { ... }
   */
  @Column('varchar', { length: 255, nullable: true, transformer: transformerDate })
  archivedAt?: Date | null

  /**
   * The projects that are part of the workspace.
   *
   * @example [Project, Project, Project]
   */
  @OneToMany(() => Project, project => project.workspace, { cascade: true, onDelete: 'CASCADE' })
  projects: Project[]

  /**
   * The assignments of the workspace to the users.
   *
   * @example [WorkspaceAssignment, WorkspaceAssignment, WorkspaceAssignment]
   */
  @OneToMany(() => WorkspaceAssignment, assignment => assignment.workspace, { cascade: true, onDelete: 'CASCADE' })
  assignments: WorkspaceAssignment[]

  /**
   * @param options The options to use when serializing the object.
   * @returns The object representation of the workspace.
   */
  serialize(options: SerializeOptions = {}): WorkspaceObject {
    const assignments = options.withAssignments
      ? getWorkspaceUserAssignments(this)?.map(assignment => ({
        user: assignment.user.serialize(),
        permissions: assignment.permissions,
      }))
      : undefined

    return {
      id: this.id,
      name: this.name,
      isPublic: this.isPublic,
      isUserWorkspace: this.isUserWorkspace,
      projects: this.projects?.map(project => project.serialize()),
      assignments,
    }
  }
}

interface SerializeOptions {
  withAssignments?: boolean
}

export interface WorkspaceAssignmentsByUserObject {
  user: UserObject
  permissions: string[]
}

export interface WorkspaceObject {
  id: string
  name: string
  isPublic: boolean
  isUserWorkspace: boolean
  projects?: ProjectObject[]
  assignments?: WorkspaceAssignmentsByUserObject[]
}
