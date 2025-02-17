import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm'
import { User } from '../../user'
import { Workspace } from '../../workspace'
import { Encrypted, VaultType } from '../utils'
import { VaultAssignment } from './VaultAssignment'
import { VaultFlowAssignment } from './VaultFlowAssignment'
import { VaultProjectAssignment } from './VaultProjectAssignment'
import { VaultVariable } from './VaultVariable'

@Entity({ name: 'Vault' })
@Unique(['name', 'workspace'])
export class Vault<T extends VaultType = VaultType> extends BaseEntity {

  /**
   * The name of the vault. This is used to identify the vault.
   * The name should be unique within the workspace.
   *
   * @example 'aws-secrets-manager-production-eu-west-1'
   */
  @Column('varchar', { length: 255 })
  name: string

  /**
   * A description of the vault. This is used to provide more information
   * about the vault and its purpose.
   *
   * @example 'Production secrets manager for the EU West 1 region.'
   */
  @Column('text', { nullable: true })
  description?: string

  /**
   * The type of vault used to store the variables. The type of vault
   * determines how the variables are stored and accessed.
   */
  @Column('varchar', { length: 255 })
  type: T

  /**
   * Configuration for the vault. The configuration is used to store
   * the settings required to access the vault.
   */
  @Column('text', { transformer: transformerJson })
  configuration: Encrypted

  /**
   * The workspace that the vault belongs to. Variables within the workspace can
   * be stored in the vault and accessed by the workspace members.
   *
   * @example Workspace { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Workspace, { nullable: false, onDelete: 'CASCADE' })
  workspace?: Workspace

  /**
   * The user that created the vault. Mainly for auditing purposes.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  createdBy?: User

  /**
   * The variables stored in the vault. Variables can be assigned to the vault
   * and stored securely.
   *
   * @example [ Variable { ... }, Variable { ... } ]
   */
  @OneToMany(() => VaultVariable, variable => variable.vault, { cascade: true })
  variables?: VaultVariable[]

  /**
   * The user assignments for this vault. Users can be assigned different
   * permission levels to access the vault.
   */
  @OneToMany(() => VaultAssignment, assignment => assignment.vault, { cascade: true })
  assignments?: VaultAssignment[]

  /**
   * The flow assignments for this vault. Flows can be assigned different
   * permission levels to access the vault.
   */
  @OneToMany(() => VaultFlowAssignment, assignment => assignment.vault, { cascade: true })
  flowAssignments?: VaultFlowAssignment[]

  /**
   * The project assignments for this vault. Projects can be assigned different
   * permission levels to access the vault.
   */
  @OneToMany(() => VaultProjectAssignment, assignment => assignment.vault, { cascade: true })
  projectAssignments?: VaultProjectAssignment[]

  /**
   * @returns The serialized representation of the vault.
   */
  serialize(): VaultObject {
    return {
      type: this.type,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}

export interface VaultObject {
  type: VaultType
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}
