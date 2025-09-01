import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { User, UserObject } from '../../user'
import { Vault, VaultObject } from './Vault'

/**
 * A `Variable` is used to store variables that can be assigned to different resources.
 * They can be used to store data that is required by the flows of the project.
 * Variables can be optionally encrypted for sensitive data storage.
 */
@Entity({ name: 'VaultVariable' })
@Index(['vault', 'name', 'deletedAt'], { unique: true })
export class VaultVariable<T = any> extends BaseEntity {

  /**
   * The vault where this variable is stored (optional)
   * If not set, the variable is stored locally
   */
  @JoinColumn()
  @ManyToOne(() => Vault, vault => vault.variables, { nullable: false })
  vault?: Vault

  /**
   * The name of the variable. This is used to identify the variable.
   * The name should be unique within the workspace.
   *
   * @example 'MY_API_KEY'
   */
  @Column('varchar', { length: 255 })
  name: string

  /**
   * The data of the variable. This is used to store additional information
   * about the variable. If the `local` key vault provider is used, this field
   * will contained the cyphered value of the variable, the IV and the tag.
   */
  @Column('text', { default: '{}', transformer: transformerJson })
  data = {} as T

  /**
   * The user that created the variable.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  createdBy?: User

  /**
   * The user that last updated the variable.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  updatedBy?: User

  /**
   * The user that deleted the variable.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  deletedBy?: User

  /**
   * @param options The options to use when serializing the variable.
   * @returns The serialized representation of the variable.
   */
  serialize(options: SerializeOptions = {}): VaultVariableObject {
    const {
      withVault = false,
      withCreatedBy = false,
      withUpdatedBy = false,
      withDeletedBy = false,
    } = options
    return {
      name: this.name,
      vault: withVault ? this.vault?.serialize() : undefined,
      createdAt: withCreatedBy ? this.createdAt.toISOString() : undefined,
      createdBy: withCreatedBy ? this.createdBy?.serialize() : undefined,
      updatedAt: withUpdatedBy ? this.updatedAt.toISOString() : undefined,
      updatedBy: withUpdatedBy ? this.updatedBy?.serialize() : undefined,
      deletedAt: withDeletedBy ? this.deletedAt?.toISOString() : undefined,
      deletedBy: withDeletedBy ? this.deletedBy?.serialize() : undefined,
    }
  }
}

interface SerializeOptions {
  withVault?: boolean
  withCreatedBy?: boolean
  withUpdatedBy?: boolean
  withDeletedBy?: boolean
}

export interface VaultVariableObject {
  name: string
  vault?: VaultObject
  createdAt?: string
  createdBy?: UserObject
  updatedAt?: string
  updatedBy?: UserObject
  deletedAt?: string
  deletedBy?: UserObject
}
