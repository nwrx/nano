import { BaseEntity } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { WorkspaceProject } from './WorkspaceProject'

/**
 * A `WorkspaceProjectVariable` is used to store the variables of a project. The variables are
 * encrypted and stored in the database. They can be used to store sensitive data
 * such as API keys, passwords, etc that are required by the flows of the project.
 */
@Entity({ name: 'WorkspaceProjectVariable' })
export class WorkspaceProjectVariable extends BaseEntity {

  /**
   * The name of the variable.
   *
   * @example 'AZURE_STORAGE_ACCOUNT'
   */
  @Column('varchar', { length: 255 })
  name: string

  /**
   * The value of the variable.
   *
   * @example '00000000-0000-0000-0000-000000000000'
   */
  @Column('text')
  value: string

  /**
   * The project to which the variable belongs.
   *
   * @example WorkspaceProject
   */
  @JoinColumn()
  @ManyToOne(() => WorkspaceProject, project => project.variables, { onDelete: 'CASCADE' })
  project: WorkspaceProject

  /**
   * @returns The object representation of the variable.
   */
  serialize(): WorkspaceProjectVariableObject {
    return {
      name: this.name,
      value: this.value,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}

export interface WorkspaceProjectVariableObject {
  name: string
  value: string
  createdAt: string
  updatedAt: string
}
