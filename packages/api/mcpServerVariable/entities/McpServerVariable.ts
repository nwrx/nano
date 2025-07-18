import { BaseEntity } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { McpServer, McpServerObject } from '../../mcpServer'
import { User, UserObject } from '../../user'
import { VaultVariable, VaultVariableObject } from '../../vault'

/**
 * Junction table for the many-to-many relationship between MCP servers and vault variables.
 * This allows MCP servers to have access to specific vault variables as environment variables
 * or configuration values.
 */
@Entity({ name: 'McpServerVariable' })
@Index(['server', 'variable', 'deletedAt'], { unique: true })
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
  mountAtPath?: string

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
   * The user that created this variable assignment.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  createdBy?: User

  /**
   * The user that last updated this variable assignment.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  updatedBy?: null | User

  /**
   * @returns The serialized object representation of the `McpServerVariable`.
   */
  serialize(): McpServerVariableObject {
    return {
      name: this.name,
      mountAtPath: this.mountAtPath,
      server: this.server?.serialize(),
      value: this.value,
      variable: this.variable?.serialize(),
      createdBy: this.createdBy?.serialize(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      updatedBy: this.updatedBy?.serialize(),
    }
  }
}

export interface McpServerVariableObject {
  name: string
  mountAtPath?: string
  server?: McpServerObject
  value?: null | string
  variable?: VaultVariableObject
  createdBy?: UserObject
  updatedBy?: UserObject
  createdAt: string
  updatedAt: string
}
