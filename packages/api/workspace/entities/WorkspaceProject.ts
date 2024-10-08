import { BaseEntity } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Flow, FlowObject } from '../../flow'
import { User, UserObject } from '../../user'
import { WorkspaceProjectPermission } from '../utils'
import { Workspace } from './Workspace'
import { WorkspaceProjectAssignment } from './WorkspaceProjectAssignment'
import { WorkspaceProjectSecret, WorkspaceProjectSecretObject } from './WorkspaceProjectSecret'
import { WorkspaceProjectVariable, WorkspaceProjectVariableObject } from './WorkspaceProjectVariable'

/**
 * A `WorkspaceProject` regroups multiple flows together. It can be used to organize the
 * flows that are part of the same project or to group the flows that are related
 * to the same topic.
 */
@Entity({ name: 'WorkspaceProject' })
export class WorkspaceProject extends BaseEntity {

  /**
   * The URL slug of the project. The slug is used to generate the URL of the project.
   * It is also used to identify the project in the database.
   *
   * @example 'resume-article'
   */
  @Column('varchar', { length: 255, unique: true })
  name: string

  /**
   * The name of the project as displayed in the UI.
   *
   * @example 'Resume Article'
   */
  @Column('varchar', { length: 255 })
  title: string

  /**
   * Description of the project.
   *
   * @example 'This project is used to resume an article.'
   */
  @Column('text', { default: '' })
  description?: string

  /**
   * Flag to declare the project as public. If the project is public, it can be viewed
   * by anyone without the need to authenticate to the workspace. By default, the project
   * is private and only the users assigned to the project can view it.
   *
   * @example false
   */
  @Column('boolean', { default: false })
  isPublic: boolean

  /**
   * The flows that are part of the project.
   *
   * @example [Flow, Flow, Flow]
   */
  @OneToMany(() => Flow, flow => flow.project, { cascade: true })
  flows?: Flow[]

  /**
   * The secrets of the project.
   *
   * @example [WorkspaceProjectSecret, WorkspaceProjectSecret]
   */
  @OneToMany(() => WorkspaceProjectSecret, secret => secret.project, { cascade: true })
  secrets?: WorkspaceProjectSecret[]

  /**
   * The variables of the project.
   *
   * @example [WorkspaceProjectVariable, WorkspaceProjectVariable]
   */
  @OneToMany(() => WorkspaceProjectVariable, variable => variable.project, { cascade: true })
  variables?: WorkspaceProjectVariable[]

  /**
   * The users assigned to the project. They can have specific permissions on the project.
   *
   * @example WorkspaceProjectAssignment { ... }
   */
  @OneToMany(() => WorkspaceProjectAssignment, assigment => assigment.project, { cascade: true })
  assignments?: WorkspaceProjectAssignment[]

  /**
   * The workspace that the project is part of.
   *
   * @example Workspace { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Workspace, workspace => workspace.projects, { onDelete: 'CASCADE', nullable: false })
  workspace?: Workspace

  /**
   * Get the assignments grouped by users. The function will return an array of objects
   * where each object contains the user and a list of permissions assigned to the user.
   *
   * @returns The assignments grouped by users.
   */
  get assignmentsByUser(): WorkspaceProjectUserPermissions[] | undefined {
    if (!this.assignments) return

    // --- Group the assignments by user.
    const result: WorkspaceProjectUserPermissions[] = []
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
   * @returns The object representation of the workspace project.
   */
  serialize(): WorkspaceProjectObject {
    return {
      name: this.name,
      title: this.title,
      description: this.description ?? undefined,
      flows: this.flows?.map(flow => flow.serialize()),
      secrets: this.secrets?.map(secret => secret.serialize()),
      variables: this.variables?.map(variable => variable.serialize()),
      assignments: this.assignmentsByUser?.map(({ user, permissions }) => ({
        user: user.serialize(),
        permissions,
      })),
    }
  }
}

export interface WorkspaceProjectUserPermissions {
  user: User
  permissions: WorkspaceProjectPermission[]
}

export interface WorkspaceProjectUserPermissionsObject {
  user: UserObject
  permissions: WorkspaceProjectPermission[]
}

export interface WorkspaceProjectObject {
  name: string
  title: string
  description?: string
  flows?: FlowObject[]
  secrets?: WorkspaceProjectSecretObject[]
  variables?: WorkspaceProjectVariableObject[]
  assignments?: WorkspaceProjectUserPermissionsObject[]
}
