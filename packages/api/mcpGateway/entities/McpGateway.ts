import { BaseEntity, transformerDate } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { McpManager, McpManagerObject } from '../../mcpManager'
import { User, UserObject } from '../../user'

@Entity({ name: 'McpGateway' })
@Index(['address', 'deletedAt'], { unique: true })
@Index(['identity', 'deletedAt'], { unique: true })
export class McpGateway extends BaseEntity {

  /**
   * The `McpManager` that this gateway is associated with. This is used to
   * link the MCP gateway to a specific manager that is responsible for
   * managing the MCP servers.
   */
  @ManyToOne(() => McpManager, { nullable: false, onDelete: 'CASCADE' })
  manager: McpManager

  /**
   * The base URL of the MCP gateway. This URL is used to make requests to
   * the MCP gateway and must be unique across all gateways. It is used to
   * identify which gateway is responsible for managing specific MCP servers.
   *
   * @example "gateway.mcp.example.com"
   */
  @Column('varchar')
  address: string

  /**
   * The identity of the MCP gateway. This identity is given by the MCP
   * gateway when it is claimed by the API. This identity is used to identify
   * the MCP gateway and should be unique across all gateways.
   *
   * @example "gateway-eu-west-1-1"
   */
  @Column('varchar')
  identity: string

  /**
   * The last time the MCP gateway was pinged. This is used to determine if
   * the MCP gateway is still alive and responding to requests. If the MCP
   * gateway does not respond to a ping request within a certain time frame, it
   * is considered dead and will be removed from the list of active managers.
   */
  @Column('varchar', { transformer: transformerDate })
  lastSeenAt: Date

  /**
   * The user responsible for registering the MCP manager. This user must be
   * a super administrator in order to register a MCP manager. This is used
   * to ensure that only authorized users can register MCP managers.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy?: User

  /**
   * The user that updated the MCP manager. This is used to track who made
   * changes to the MCP gateway and is useful for auditing purposes. This field
   * is optional and may be undefined if the MCP gateway has not been updated
   * since it was created.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updatedBy?: null | User

  /**
   * The date at which the MCP gateway was disabled. When defined, this
   * indicates that the MCP gateway is no longer active and should not be
   * used to manage MCP resources. This is used to disable MCP managers without
   * deleting them from the database.
   */
  @Column('varchar', { transformer: transformerDate, nullable: true })
  disabledAt: Date | null

  /**
   * The user that disabled the MCP manager. This is used to track who
   * disabled the MCP gateway and is useful for auditing purposes. This field
   * is optional and may be undefined if the MCP gateway has not been disabled
   * since it was created.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  disabledBy?: null | User

  /**
   * The user that deleted the MCP manager. This is used to track who
   * deleted the MCP gateway and is useful for auditing purposes. This field
   * is optional and may be undefined if the MCP gateway has not been deleted
   * since it was created.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  deletedBy?: null | User

  /**
   * @param options Options for serialization.
   * @returns The serialized representation of the MCP gateway.
   */
  serialize(options: SerializeOptions = {}): McpGatewayObject {
    const {
      withDeleted = false,
      withManager = false,
      withCreatedBy = false,
      withUpdatedBy = false,
      withDisabledBy = false,
    } = options

    return {
      address: this.address,
      identity: this.identity,
      lastSeenAt: this.lastSeenAt.toISOString(),
      disabledAt: this.disabledAt ? this.disabledAt.toISOString() : undefined,
      disabledBy: withDisabledBy && this.disabledBy ? this.disabledBy.serialize() : undefined,

      // Relations
      manager: withManager
        ? this.manager?.serialize({ withDeleted, withCreatedBy, withUpdatedBy, withDisabledBy })
        : undefined,

      // Audit
      createdAt: withCreatedBy ? this.createdAt?.toISOString() : undefined,
      createdBy: withCreatedBy ? this.createdBy?.serialize() : undefined,
      updatedAt: withUpdatedBy ? this.updatedAt?.toISOString() : undefined,
      updatedBy: withUpdatedBy ? this.updatedBy?.serialize() : undefined,
      deletedAt: withDeleted && this.deletedAt ? this.deletedAt.toISOString() : undefined,
      deletedBy: withDeleted && this.deletedBy ? this.deletedBy.serialize() : undefined,
    }
  }
}

interface SerializeOptions {
  withDeleted?: boolean
  withManager?: boolean
  withCreatedBy?: boolean
  withUpdatedBy?: boolean
  withDisabledBy?: boolean
}

export interface McpGatewayObject {
  address: string
  identity: string
  lastSeenAt: string
  disabledAt?: string
  disabledBy?: UserObject

  // Relations
  manager?: McpManagerObject

  // Audit
  createdAt?: string
  createdBy?: UserObject
  updatedAt?: string
  updatedBy?: UserObject
  deletedAt?: string
  deletedBy?: UserObject
}
