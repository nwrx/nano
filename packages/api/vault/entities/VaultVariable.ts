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
   * @param options The options to use when serializing the variable.
   * @returns The serialized representation of the variable.
   */
  serialize(options: SerializeOptions = {}): VaultVariableObject {
    return {
      name: this.name,
      createdBy: this.createdBy?.serialize(),
      updatedBy: this.updatedBy?.serialize(),
      deletedAt: this.deletedAt?.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      vault: options.withVault ? this.vault?.serialize() : undefined,
    }
  }
}

interface SerializeOptions {
  withVault?: boolean
}

export interface VaultVariableObject {
  name: string
  createdBy?: UserObject
  updatedBy?: UserObject
  deletedAt?: string
  createdAt: string
  updatedAt: string
  vault?: VaultObject
}
