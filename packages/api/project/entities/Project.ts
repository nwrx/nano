import { BaseEntity } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Flow, FlowObject } from '../../flow'
import { UserObject } from '../../user'
import { Workspace } from '../../workspace'
import { ProjectPermission } from '../utils'
import { ProjectAssignment } from './ProjectAssignment'

/**
 * A `Project` regroups multiple flows together. It can be used to organize the
 * flows that are part of the same project or to group the flows that are related
 * to the same topic.
 */
@Entity({ name: 'Project' })
@Index(['workspace', 'name'], { unique: true })
export class Project extends BaseEntity {

  /**
   * The URL slug of the project. The slug is used to generate the URL of the project.
   * It is also used to identify the project in the database.
   *
   * @example 'resume-article'
   */
  @Column('varchar', { length: 255 })
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
  description = ''

  /**
   * Flag to declare the project as public. If the project is public, it can be viewed
   * by anyone without the need to authenticate to the workspace. By default, the project
   * is private and only the users assigned to the project can view it.
   *
   * @example false
   */
  @Column('boolean', { default: false })
  isPublic = false

  /**
   * The flows that are part of the project.
   *
   * @example [Flow, Flow, Flow]
   */
  @OneToMany(() => Flow, flow => flow.project, { cascade: true })
  flows: Flow[] | undefined

  /**
   * The users assigned to the project. They can have specific permissions on the project.
   *
   * @example ProjectAssignment { ... }
   */
  @OneToMany(() => ProjectAssignment, assigment => assigment.project, { cascade: true })
  assignments: ProjectAssignment[] | undefined

  /**
   * The workspace that the project is part of.
   *
   * @example Workspace { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Workspace, workspace => workspace.projects, { onDelete: 'CASCADE', nullable: false })
  workspace: undefined | Workspace

  /**
   * @returns The object representation of the workspace project.
   */
  serialize(): ProjectObject {
    return {
      name: this.name,
      title: this.title,
      description: this.description,
      flows: this.flows?.map(flow => flow.serialize()),
    }
  }
}

export interface ProjectUserPermissionsObject {
  user: UserObject
  permissions: ProjectPermission[]
}

export interface ProjectObject {
  name: string
  title: string
  description: string
  flows?: FlowObject[]
}
