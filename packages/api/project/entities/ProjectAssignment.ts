import type { ProjectPermission } from '../utils'
import { BaseEntity } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { User } from '../../user'
import { Project } from './Project'

/**
 * A `ProjectAssignment` is used to assign a project to a user. The assignment
 * is used to give the user access to the project and to allow the user to edit,
 * delete, and share the project with other users.
 */
@Entity({ name: 'ProjectAssignment' })
@Unique(['user', 'project', 'permission'])
export class ProjectAssignment extends BaseEntity {

  /**
   * The user that is assigned to the project.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  user: undefined | User

  /**
   * The project that is assigned to the user.
   *
   * @example Project { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Project, project => project.assignments, { onDelete: 'CASCADE', nullable: false })
  project: Project | undefined

  /**
   * The permission that the user has on the project assigned. The permission
   * is used to determine what the user can do with the project and its contents.
   *
   * @example 'Read'
   */
  @Column('varchar', { length: 32 })
  permission: ProjectPermission
}
