import { BaseEntity } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { McpServer } from '../../mcpServer'
import { User, UserObject } from '../../user'
import { VaultVariable, VaultVariableObject } from '../../vault'

/**
 * Junction table for the many-to-many relationship between MCP servers and vault variables.
 * This allows MCP servers to have access to specific vault variables as environment variables
 * or configuration values.
 */
@Entity({ name: 'McpServerVariable' })
@Index(['name', 'server', 'variable', 'deletedAt'], { unique: true })
export class McpServerVariable extends BaseEntity {

  /**
   * The environment variable name that will be used to expose this variable
   * to the MCP server container. If not specified, the variable's original
   * name will be used.
   *
   * @example 'DATABASE_PASSWORD'
   */
  @Column('varchar', { length: 255 })
  name: string

  /**
   * The file path where the variable should be mounted in the container.
   * When specified, the variable value will be written to a file at this path
   * instead of being exposed as an environment variable.
   *
   * @example '/app/config/database.conf'
   */
  @Column('varchar', { length: 500, nullable: true })
  mountAtPath?: null | string

  /**
   * The MCP server that has access to the variable.
   */
  @JoinColumn()
  @ManyToOne(() => McpServer, { nullable: false, onDelete: 'CASCADE' })
  server?: McpServer

  /**
   * The raw value of the variable. This is used if the variable is not linked to a
   * specific vault variable. It allows for direct assignment of values to the server.
   * This field is optional and can be used in cases where the variable does not
   * contain sensitive information or does not require vault management.
   */
  @Column('text', { nullable: true })
  value?: null | string

  /**
   * The vault variable that is accessible by the server.
   */
  @JoinColumn()
  @ManyToOne(() => VaultVariable, { nullable: true, onDelete: 'CASCADE' })
  variable?: null | VaultVariable

  /**
   * The user responsible for registering the MCP server variable. This user must be
   * a super administrator in order to register a MCP server variable. This is used
   * to ensure that only authorized users can register MCP server variables.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy?: User

  /**
   * The user that updated the MCP server variable. This is used to track who made
   * changes to the MCP server variable and is useful for auditing purposes. This field
   * is optional and may be undefined if the MCP server variable has not been updated
   * since it was created.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updatedBy?: null | User

  /**
   * The user that deleted the MCP server variable. This is used to track who
   * deleted the MCP server variable and is useful for auditing purposes. This field
   * is optional and may be undefined if the MCP server variable has not been deleted
   * since it was created.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  deletedBy?: null | User

  /**
   * @param options The options to use when serializing the MCP server variable.
   * @returns The serialized object representation of the `McpServerVariable`.
   */
  serialize(options: SerializeOptions = {}): McpServerVariableObject {
    const {
      withValue = false,
      withVault = false,
      withVariable = false,
      withCreatedBy = false,
      withUpdatedBy = false,
      withDeleted = false,
    } = options
    return {
      name: this.name,
      mountAtPath: this.mountAtPath ?? undefined,

      // Relationships
      value: withValue ? this.value ?? undefined : undefined,
      variable: withVariable ? this.variable?.serialize({ withVault }) : undefined,

      // Metadata
      createdBy: withCreatedBy ? this.createdBy?.serialize() : undefined,
      createdAt: withCreatedBy ? this.createdAt.toISOString() : undefined,
      updatedBy: withUpdatedBy ? this.updatedBy?.serialize() : undefined,
      updatedAt: withUpdatedBy ? this.updatedAt.toISOString() : undefined,
      deletedBy: withDeleted ? this.deletedBy?.serialize() : undefined,
      deletedAt: withDeleted ? this.deletedAt?.toISOString() : undefined,
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

export interface McpServerVariableObject {
  name: string
  mountAtPath?: string
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
