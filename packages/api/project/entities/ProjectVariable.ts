import { BaseEntity } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { User } from '../../user'
import { Project } from './Project'

/**
 * A `ProjectVariable` is used to store the variables of a project. The variables are
 * encrypted and stored in the database. They can be used to store sensitive data
 * such as API keys, passwords, etc that are required by the flows of the project.
 */
@Entity({ name: 'ProjectVariable' })
@Unique(['name', 'project'])
export class ProjectVariable extends BaseEntity {

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
   * @example Project
   */
  @JoinColumn()
  @ManyToOne(() => Project, project => project.variables, { nullable: false, onDelete: 'RESTRICT' })
  project?: Project

  /**
   * The user responsible for creating the variable.
   *
   * @example User
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  createdBy?: User

  /**
   * @returns The object representation of the variable.
   */
  serialize(): ProjectVariableObject {
    return {
      name: this.name,
      value: this.value,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}

export interface ProjectVariableObject {
  name: string
  value: string
  createdAt: string
  updatedAt: string
}
