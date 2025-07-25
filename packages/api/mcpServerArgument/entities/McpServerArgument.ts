import { BaseEntity } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { McpServer } from '../../mcpServer'
import { User, UserObject } from '../../user'
import { VaultVariable, VaultVariableObject } from '../../vault'

/**
 * Junction table for the many-to-many relationship between MCP servers and arguments.
 * This allows MCP servers to have dynamic command line arguments that can be sourced
 * from vault variables or direct values.
 */
@Entity({ name: 'McpServerArgument' })
@Index(['server', 'position', 'deletedAt'], { unique: true })
export class McpServerArgument extends BaseEntity {

  /**
   * The MCP server that this argument belongs to.
   */
  @JoinColumn()
  @ManyToOne(() => McpServer, { nullable: false, onDelete: 'CASCADE' })
  server?: McpServer

  /**
   * The position of this argument in the command line arguments array.
   * This determines the order in which arguments are passed to the server command.
   *
   * @example 0, 1, 2, etc.
   */
  @Column('integer')
  position: number

  /**
   * The raw value of the argument. This is used if the argument is not linked to a
   * specific vault variable. It allows for direct assignment of values to the server.
   * This field is optional and can be used in cases where the argument does not
   * contain sensitive information or does not require vault management.
   */
  @Column('text', { nullable: true })
  value?: null | string

  /**
   * The vault variable that provides the value for this argument.
   */
  @JoinColumn()
  @ManyToOne(() => VaultVariable, { nullable: true, onDelete: 'CASCADE' })
  variable?: null | VaultVariable

  /**
   * The user that created this argument assignment.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  createdBy?: User

  /**
   * The user that last updated this argument assignment.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  updatedBy?: null | User

  /**
   * The user that deleted this argument assignment.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  deletedBy?: null | User

  /**
   * @param options The options to use when serializing the `McpServerArgument`.
   * @returns The serialized object representation of the `McpServerArgument`.
   */
  serialize(options: SerializeOptions = {}): McpServerArgumentObject {
    const {
      withValue = false,
      withVault = false,
      withVariable = false,
      withCreatedBy = false,
      withUpdatedBy = false,
      withDeleted = false,
    } = options
    return {
      position: this.position,
      value: withValue ? this.value ?? undefined : undefined,
      variable: withVariable && this.variable ? this.variable.serialize({ withVault }) : undefined,

      // Metadata
      createdBy: withCreatedBy ? this.createdBy?.serialize() : undefined,
      createdAt: this.createdAt.toISOString(),
      updatedBy: withUpdatedBy ? this.updatedBy?.serialize() : undefined,
      updatedAt: this.updatedAt.toISOString(),
      deletedBy: withDeleted && this.deletedBy ? this.deletedBy.serialize() : undefined,
      deletedAt: this.deletedAt?.toISOString(),
    }
  }
}

interface SerializeOptions {
  withValue?: boolean
  withVault?: boolean
  withVariable?: boolean
  withCreatedBy?: boolean
  withUpdatedBy?: boolean
  withDeleted?: boolean
}

export interface McpServerArgumentObject {
  position: number
  value?: string
  variable?: VaultVariableObject

  // Metadata
  createdBy?: UserObject
  createdAt?: string
  updatedBy?: UserObject
  updatedAt?: string
  deletedBy?: UserObject
  deletedAt?: string
}
