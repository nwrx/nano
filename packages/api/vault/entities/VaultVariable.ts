import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { User } from '../../user'
import { Vault, VaultObject } from './Vault'

/**
 * A `Variable` is used to store variables that can be assigned to different resources.
 * They can be used to store data that is required by the flows of the project.
 * Variables can be optionally encrypted for sensitive data storage.
 */
@Entity({ name: 'VaultVariable' })
@Unique(['name', 'vault'])
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
   * @returns The serialized representation of the variable.
   */
  serialize(): VaultVariableObject {
    return {
      name: this.name,
      vault: this.vault?.serialize(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}

export interface VaultVariableObject {
  name: string
  vault?: VaultObject
  createdAt: string
  updatedAt: string
}
