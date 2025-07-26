/* eslint-disable unicorn/no-null */
import type { Tool } from '@modelcontextprotocol/sdk/types.js'
import type { McpServerSpec } from '../utils/assertMcpServerSpec'
import { BaseEntity, transformerDate, transformerJson } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { McpPool, McpPoolObject } from '../../mcpPool'
import { McpServerArgument } from '../../mcpServerArgument'
import { McpServerEvent } from '../../mcpServerEvent'
import { McpServerVariable } from '../../mcpServerVariable'
import { User, UserObject } from '../../user'
import { DEFAULT_MCP_SERVER_SPEC } from '../utils/constants'

/**
 * An `McpServer` represents a single MCP server instance that runs within
 * a pool. It contains the configuration and status of the server.
 */
@Entity({ name: 'McpServer' })
@Index(['pool', 'name', 'deletedAt'], { unique: true })
export class McpServer extends BaseEntity {

  /**
   * The name of the MCP server. This is used to identify the server.
   * The name should be unique within the pool.
   *
   * @example 'weather-service-server'
   */
  @Column('varchar', { length: 255 })
  name: string

  /**
   * The title of the MCP server. This is used to display the server's name
   * in the UI and should be user-friendly.
   *
   * @example 'Weather Service Server'
   */
  @Column('varchar', { length: 255 })
  title: string

  /**
   * A description of the MCP server. This is used to provide more information
   * about the server and its purpose.
   *
   * @example 'Weather service MCP server providing current conditions and forecasts'
   */
  @Column('text', { default: '' })
  description = ''

  /**
   * The pool that manages this server. This is a reference to the
   * `McpPool` entity that contains the server. The pool is responsible for
   * managing the server's default configuration and allows for limiting the
   * number of servers that can be created within it.
   */
  @JoinColumn()
  @ManyToOne(() => McpPool, pool => pool.servers, { nullable: false })
  pool?: McpPool

  /**
   * The specifications of the `McpServer`. This is a JSON object that contains
   * the server's configuration, such as the container image, command, transport type,
   * and transport port. This allows for flexible configuration of the server
   * without needing to modify the database schema.
   */
  @Column('text', { transformer: transformerJson, default: JSON.stringify(DEFAULT_MCP_SERVER_SPEC) })
  spec: McpServerSpec = DEFAULT_MCP_SERVER_SPEC

  /**
   * The tools that the server provide. This field records the last time the
   * server's tools were updated. It is used list the tools without having to
   * start the server.
   */
  @Column('varchar', { nullable: true, transformer: transformerJson, default: '[]' })
  tools: null | Tool[]

  /**
   * The events that occurred on the server. This field is used to track
   * the server's lifecycle and can be used to debug issues or monitor the server's
   * performance. It is a one-to-many relationship with the `McpServerEvent` entity.
   * Each event is associated with a specific server and contains information about
   * the event's origin, data, and any associated thread.
   */
  @OneToMany(() => McpServerEvent, event => event.server)
  events?: McpServerEvent[]

  /**
   * The arguments assigned to the server. These arguments can be used to
   * configure the server's command line parameters and behavior.
   */
  @OneToMany(() => McpServerArgument, argument => argument.server)
  arguments?: McpServerArgument[]

  /**
   * The variables assigned to the server. These variables can be used to
   * configure the server's environment and behavior.
   */
  @OneToMany(() => McpServerVariable, variable => variable.server)
  variables?: McpServerVariable[]

  /**
   * The date and time when the server was disabled. Also acts as a
   * flag to indicate if the server is disabled.
   */
  @Column('varchar', { nullable: true, transformer: transformerDate })
  disabledAt: Date | null

  /**
   * The user responsible for disabling the server.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  disabledBy?: null | User

  /**
   * The user that created the server.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy?: User

  /**
   * The user that last updated the server.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updatedBy?: null | User

  /**
   * The user responsible for deleting the server.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  deletedBy?: null | User

  /**
   * @param options The options to use when serializing the server.
   * @returns The serialized representation of the server.
   */
  serialize(options: SerializeOptions = {}): McpServerObject {
    const {
      withPool = false,
      withSpec = false,
      withTools = false,
      withCreatedBy = false,
      withUpdatedBy = false,
      withDisabledBy = false,
      withDeleted = false,
    } = options
    return {
      name: this.name,
      title: this.title,
      description: this.description,
      disabledAt: this.disabledAt?.toISOString() ?? null,
      disabledBy: withDisabledBy ? this.disabledBy?.serialize() : undefined,

      // Relationships
      spec: withSpec ? this.spec : undefined,
      pool: withPool ? this.pool?.serialize() : undefined,
      tools: withTools ? this.tools ?? [] : undefined,

      // Metadata
      createdAt: withCreatedBy ? this.createdAt.toISOString() : undefined,
      createdBy: withCreatedBy ? this.createdBy?.serialize() : undefined,
      updatedAt: withUpdatedBy ? this.updatedAt.toISOString() : undefined,
      updatedBy: withUpdatedBy ? this.updatedBy?.serialize() : undefined,
      deletedAt: withDeleted ? this.deletedAt?.toISOString() : undefined,
      deletedBy: withDeleted ? this.deletedBy?.serialize() : undefined,
    }
  }
}

interface SerializeOptions {
  withPool?: boolean
  withSpec?: boolean
  withTools?: boolean
  withCreatedBy?: boolean
  withUpdatedBy?: boolean
  withDisabledBy?: boolean
  withDeleted?: boolean
}

export interface McpServerObject {
  name: string
  title: string
  description: string
  disabledBy?: UserObject
  disabledAt: null | string

  // Relationships
  spec?: McpServerSpec
  pool?: McpPoolObject
  tools?: Tool[]

  // Metadata
  createdAt?: string
  createdBy?: UserObject
  updatedAt?: string
  updatedBy?: UserObject
  deletedAt?: string
  deletedBy?: UserObject
}
