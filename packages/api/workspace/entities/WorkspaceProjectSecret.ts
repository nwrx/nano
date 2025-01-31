import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { WorkspaceProject } from './WorkspaceProject'

/**
 * A `WorkspaceProjectSecret` is used to store the secrets of a project. The secrets are
 * encrypted and stored in the database. They can be used to store sensitive data
 * such as API keys, passwords, etc that are required by the flows of the project.
 */
@Entity({ name: 'WorkspaceProjectSecret' })
export class WorkspaceProjectSecret extends BaseEntity {

  /**
   * The name of the secret.
   *
   * @example 'AZURE_STORAGE_CREDENTIALS'
   */
  @Column('varchar', { length: 255 })
  name: string

  /**
   * The value of the secret.
   *
   * @example '<encrypted-value-base64>'
   */
  @Column('text')
  cipher: string

  /**
   * The encryption parameters used to encrypt the secret.
   * This is used to decrypt the secret when it is needed.
   *
   * @example { algorithm: 'aes-256-cbc', iv: '<iv-base64>' }
   */
  @Column('text', { transformer: transformerJson, default: '{}' })
  options: { algorithm: string; iv: string }

  /**
   * The project to which the secret belongs.
   *
   * @example WorkspaceProject
   */
  @JoinColumn()
  @ManyToOne(() => WorkspaceProject, project => project.secrets, { onDelete: 'CASCADE' })
  project: WorkspaceProject

  /**
   * @returns The object representation of the secret.
   */
  serialize(): WorkspaceProjectSecretObject {
    return {
      name: this.name,
      updatedAt: this.updatedAt.toISOString(),
      createdAt: this.createdAt.toISOString(),
    }
  }
}

export interface WorkspaceProjectSecretObject {
  name: string
  updatedAt: string
  createdAt: string
}
