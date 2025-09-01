/* eslint-disable unicorn/no-null */
import type { Encrypted } from '../../utils'
import { BaseEntity, transformerDate, transformerJson } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { User } from '../../user'
import { Workspace } from '../../workspace'
import { VaultType } from '../utils'
import { VaultAssignment } from './VaultAssignment'
import { VaultProjectAssignment } from './VaultProjectAssignment'
import { VaultVariable } from './VaultVariable'

@Entity({ name: 'Vault' })
@Index(['workspace', 'name', 'deletedAt'])
export class Vault<T extends VaultType = VaultType> extends BaseEntity {

  /**
   * The name of the vault. This is used to identify the vault.
   * The name should be unique within the workspace.
   *
   * @example 'aws-secrets-manager-production-eu-west-1'
   */
  @Column('varchar')
  name: string

  /**
   * A description of the vault. This is used to provide more information
   * about the vault and its purpose.
   *
   * @example 'Production secrets manager for the EU West 1 region.'
   */
  @Column('text')
  description = ''

  /**
   * The type of vault used to store the variables. The type of vault
   * determines how the variables are stored and accessed.
   */
  @Column('varchar')
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
  @ManyToOne(() => Workspace, { nullable: false })
  workspace?: Workspace

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
   * The projects that have access to the vault. Projects can be assigned
   * different permission levels to access the vault.
   */
  @OneToMany(() => VaultProjectAssignment, assignment => assignment.vault, { cascade: true })
  projects?: VaultProjectAssignment[]

  /**
   * The date at witch the vault was disabled. If the vault is disabled, it will
   * no longer be accessible to the workspace members.
   */
  @Column('varchar', { nullable: true, transformer: transformerDate })
  disabledAt: Date | null = null

  /**
   * The user that disabled the vault.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  disabledBy?: User

  /**
   * The user that created the vault.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy?: User

  /**
   * The user that updated the vault.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updatedBy?: User

  /**
   * The user that deleted the vault.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  deletedBy?: User

  /**
   * @returns The serialized representation of the vault.
   */
  serialize(): VaultObject {
    return {
      name: this.name,
      type: this.type,
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      deletedAt: this.deletedAt?.toISOString(),
      disabledAt: this.disabledAt?.toISOString(),
    }
  }
}

export interface VaultObject {
  name: string
  type: VaultType
  description: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  disabledAt?: string
}
