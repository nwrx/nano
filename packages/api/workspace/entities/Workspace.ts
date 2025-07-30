import { BaseEntity, transformerDate } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { User, UserObject } from '../../user'
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
   * The assignments of the workspace to the users.
   *
   * @example [WorkspaceAssignment, WorkspaceAssignment, WorkspaceAssignment]
   */
  @OneToMany(() => WorkspaceAssignment, assignment => assignment.workspace, { cascade: true })
  assignments: undefined | WorkspaceAssignment[]

  /**
   * Date at which the workspace was archived. If the workspace is archived, it can no longer
   * be edited by the users but can still be viewed by the users who have access to the workspace.
   *
   * @example Date { ... }
   */
  @Column('varchar', { nullable: true, transformer: transformerDate })
  archivedAt: Date | null

  /**
   * The user who created the workspace.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy?: User

  /**
   * The user who last updated the workspace.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updatedBy?: null | User

  /**
   * The user who deleted the workspace.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  deletedBy?: null | User

  /**
   * The user who archived the workspace.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  archivedBy?: null | User

  /**
   * @param options The options to serialize the workspace with.
   * @returns The object representation of the workspace.
   */
  serialize(options: SerializeOptions = {}): WorkspaceObject {
    const {
      withCreatedBy = false,
      withUpdatedBy = false,
      withDeletedBy = false,
      withArchivedBy = false,
    } = options
    return {
      name: this.name,
      isPublic: this.isPublic,

      // Metadata
      createdAt: withCreatedBy ? this.createdAt?.toISOString() : undefined,
      createdBy: withCreatedBy ? this.createdBy?.serialize() : undefined,
      updatedAt: withUpdatedBy ? this.updatedAt?.toISOString() : undefined,
      updatedBy: withUpdatedBy ? this.updatedBy?.serialize() : undefined,
      deletedAt: withDeletedBy ? this.deletedAt?.toISOString() : undefined,
      deletedBy: withDeletedBy ? this.deletedBy?.serialize() : undefined,
      archivedAt: withArchivedBy ? this.archivedAt?.toISOString() : undefined,
      archivedBy: withArchivedBy ? this.archivedBy?.serialize() : undefined,
    }
  }
}

interface SerializeOptions {
  withCreatedBy?: boolean
  withUpdatedBy?: boolean
  withDeletedBy?: boolean
  withArchivedBy?: boolean
}

export interface WorkspaceObject {
  name: string
  isPublic: boolean

  // Metadata
  createdAt?: string
  createdBy?: UserObject
  updatedAt?: string
  updatedBy?: UserObject
  deletedAt?: string
  deletedBy?: UserObject
  archivedAt?: string
  archivedBy?: UserObject
}
