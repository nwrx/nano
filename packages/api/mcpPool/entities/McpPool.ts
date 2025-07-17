import type { McpPoolSpec } from '../utils/assertMcpPoolSpec'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { McpManager, McpManagerObject } from '../../mcpManager'
import { McpServer, McpServerObject } from '../../mcpServer'
import { User, UserObject } from '../../user'
import { Workspace } from '../../workspace'
import { DEFAULT_MCP_POOL_SPEC } from '../utils/constants'
import { McpPoolAssignment } from './McpPoolAssignment'
import { McpPoolProjectAssignment } from './McpPoolProjectAssignment'

/**
 * An `McpPool` manages a collection of MCP servers within a workspace.
 * It defines resource limits, scaling policies, and default configurations
 * for the servers it manages.
 */
@Entity({ name: 'McpPool' })
@Index(['workspace', 'name', 'deletedAt'], { unique: true })
export class McpPool extends BaseEntity {

  /**
   * The name of the MCP pool. This is used to identify the pool.
   * The name should be unique within the workspace.
   *
   * @example 'production-pool'
   */
  @Column('varchar', { length: 255 })
  name: string

  /**
   * A human-readable title for the MCP pool. This is used to provide
   * a more descriptive name for the pool.
   *
   * @example 'Production MCP Servers Pool'
   */
  @Column('varchar', { length: 255, nullable: true })
  title?: string

  /**
   * A description of the MCP pool. This is used to provide more information
   * about the pool and its purpose.
   *
   * @example 'Production MCP servers pool for high-availability workloads'
   */
  @Column('text', { default: '' })
  description = ''

  /**
   * The specifications of the MCP pool, including default resource limits,
   * scaling policies, and other configurations.
   */
  @Column('text', { transformer: transformerJson, default: JSON.stringify(DEFAULT_MCP_POOL_SPEC) })
  spec: McpPoolSpec = DEFAULT_MCP_POOL_SPEC

  /**
   * The workspace that the pool belongs to. Servers within the pool can
   * be accessed by the workspace members based on their permissions.
   *
   * @example Workspace { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Workspace, { nullable: false })
  workspace?: Workspace

  /**
   * The MCP manager responsible for managing this pool. This establishes
   * a direct relationship between the pool and its designated manager.
   */
  @JoinColumn()
  @ManyToOne(() => McpManager, { nullable: true })
  manager?: McpManager | null

  /**
   * The servers managed by this pool.
   */
  @OneToMany(() => McpServer, server => server.pool, { cascade: true })
  servers?: McpServer[]

  /**
   * The user assignments for this pool. Users can be assigned different
   * permission levels to access the pool.
   */
  @OneToMany(() => McpPoolAssignment, assignment => assignment.pool, { cascade: true })
  assignments?: McpPoolAssignment[]

  /**
   * The project assignments for this pool. Projects can be assigned
   * different permission levels to access the pool.
   */
  @OneToMany(() => McpPoolProjectAssignment, assignment => assignment.pool, { cascade: true })
  projectAssignments?: McpPoolProjectAssignment[]

  /**
   * The user that created the pool.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy?: User

  /**
   * The user that last updated the pool.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updatedBy?: null | User

  /**
   * The user that deleted the pool, if applicable.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  deletedBy?: null | User

  /**
   * @param options The options to use when serializing the pool.
   * @returns The serialized representation of the pool.
   */
  serialize(options: SerializeOptions = {}): McpPoolObject {
    const {
      withSpec = false,
      withManager = false,
      withGateways = false,
      withServers = false,
      // withAssignments = false,
      // withProjectAssignments = false,
    } = options
    return {
      name: this.name,
      title: this.title ?? this.name,
      description: this.description,
      spec: withSpec ? this.spec : undefined,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      deletedAt: this.deletedAt?.toISOString(),
      createdBy: this.createdBy?.serialize(),
      updatedBy: this.updatedBy?.serialize(),
      manager: withManager ? this.manager?.serialize({ withGateways }) : undefined,
      servers: withServers ? this.servers?.map(server => server.serialize()) : undefined,
    }
  }
}

interface SerializeOptions {
  withSpec?: boolean

  // Relations
  withManager?: boolean
  withGateways?: boolean
  withServers?: boolean
  withAssignments?: boolean
  withProjectAssignments?: boolean
}

export interface McpPoolObject {
  name: string
  title: string
  description: string
  spec?: McpPoolSpec

  // Relations
  manager?: McpManagerObject
  servers?: McpServerObject[]
  assignments?: McpPoolAssignment[]
  projectAssignments?: McpPoolProjectAssignment[]

  // Audit
  createdAt: string
  createdBy?: UserObject
  updatedAt: string
  updatedBy?: UserObject
  deletedAt?: string
  deletedBy?: UserObject
}
