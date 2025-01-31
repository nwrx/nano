import { BaseEntity } from '@unserved/server'
import { CipherGCMTypes } from 'node:crypto'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { User } from '../../user'
import { Project } from './Project'

/**
 * A `ProjectSecret` is used to store the secrets of a project. The secrets are
 * encrypted and stored in the database. They can be used to store sensitive data
 * such as API keys, passwords, etc that are required by the flows of the project.
 */
@Entity({ name: 'ProjectSecret' })
@Unique(['name', 'project'])
export class ProjectSecret extends BaseEntity {

  /**
   * The name of the secret.
   *
   * @example 'AZURE_STORAGE_CREDENTIALS'
   */
  @Column('varchar', { length: 255 })
  name: string

  /**
   * The IV used to encrypt the secret.
   *
   * @example '<iv-base64>'
   */
  @Column('varchar', { length: 255 })
  iv: string

  /**
   * The authentication tag used to verify the integrity of the secret.
   *
   * @example '<auth-tag-base64>'
   */
  @Column('varchar', { length: 255 })
  tag: string

  /**
   * The value of the secret.
   *
   * @example '<encrypted-value-base64>'
   */
  @Column('varchar', { length: 255 })
  cipher: string

  /**
   * The salt used to encrypt the secret.
   *
   * @example '<salt-base64>'
   */
  @Column('varchar', { length: 255 })
  salt: string

  /**
   * The algorithm used to encrypt the secret.
   *
   * @example 'aes-256-gcm'
   */
  @Column('varchar', { length: 255 })
  algorithm: CipherGCMTypes

  /**
   * The project to which the secret belongs.
   *
   * @example Project
   */
  @JoinColumn()
  @ManyToOne(() => Project, project => project.secrets, { nullable: false, onDelete: 'CASCADE' })
  project?: Project

  /**
   * The user responsible for creating the secret.
   *
   * @example User
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  createdBy?: User

  /**
   * @returns The object representation of the secret.
   */
  serialize(): ProjectSecretObject {
    return {
      name: this.name,
      updatedAt: this.updatedAt.toISOString(),
      createdAt: this.createdAt.toISOString(),
    }
  }
}

export interface ProjectSecretObject {
  name: string
  updatedAt: string
  createdAt: string
}
