import { BaseEntity, transformerDate } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { McpGateway, McpGatewayObject } from '../../mcpGateway'
import { User, UserObject } from '../../user'

@Entity({ name: 'McpManager' })
@Index(['address', 'deletedAt'], { unique: true })
@Index(['identity', 'deletedAt'], { unique: true })
export class McpManager extends BaseEntity {

  /**
   * The gateway servers that this MCP manager is responsible for managing.
   * This is used to have a centralized management point for MCP resources
   * across multiple gateways.
   */
  @JoinColumn()
  @OneToMany(() => McpGateway, gateway => gateway.manager, { cascade: true })
  gateways?: McpGateway[]

  /**
   * The base URL of the MCP manager. This URL is used to make requests to
   * the MCP manager and must be unique across all managers. It is used to
   * identify which manager is responsible for managing specific MCP resources.
   *
   * @example "manager.mcp.example.com"
   */
  @Column('varchar')
  address: string

  /**
   * The identity of the MCP manager. This identity is given by the MCP
   * manager when it is claimed by the API. This identity is used to identify
   * the MCP manager and should be unique across all managers.
   *
   * @example "manager-eu-west-1-1"
   */
  @Column('varchar')
  identity: string

  /**
   * The last time the MCP manager was pinged. This is used to determine if
   * the MCP manager is still alive and responding to requests. If the MCP
   * manager does not respond to a ping request within a certain time frame, it
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
   * changes to the MCP manager and is useful for auditing purposes. This field
   * is optional and may be undefined if the MCP manager has not been updated
   * since it was created.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updatedBy?: null | User

  /**
   * The date at which the MCP manager was disabled. When defined, this
   * indicates that the MCP manager is no longer active and should not be
   * used to manage MCP resources. This is used to disable MCP managers without
   * deleting them from the database.
   */
  @Column('varchar', { transformer: transformerDate, nullable: true })
  disabledAt: Date | null

  /**
   * The user that disabled the MCP manager. This is used to track who
   * disabled the MCP manager and is useful for auditing purposes. This field
   * is optional and may be undefined if the MCP manager has not been disabled
   * since it was created.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  disabledBy?: null | User

  /**
   * The user that deleted the MCP manager. This is used to track who
   * deleted the MCP manager and is useful for auditing purposes. This field
   * is optional and may be undefined if the MCP manager has not been deleted
   * since it was created.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  deletedBy?: null | User

  /**
   * @param options The options to use when serializing the MCP manager.
   * @returns The serialized representation of the MCP manager.
   */
  serialize(options: SerializeOptions = {}): McpManagerObject {
    const {
      withDeleted = false,
      withGateways = true,
      withCreatedBy = true,
      withUpdatedBy = true,
      withDisabledBy = true,
    } = options
    return {
      address: this.address,
      identity: this.identity,
      lastSeenAt: this.lastSeenAt.toISOString(),

      // Disabled
      disabledAt: this.disabledAt?.toISOString(),
      disabledBy: withDisabledBy ? this.disabledBy?.serialize() : undefined,

      // Relations
      gateways: withGateways
        ? this.gateways?.map(gateway => gateway.serialize({
          withDeleted,
          withCreatedBy,
          withUpdatedBy,
          withDisabledBy,
        }))
        : undefined,

      // Audit
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
  withDeleted?: boolean
  withGateways?: boolean
  withCreatedBy?: boolean
  withUpdatedBy?: boolean
  withDisabledBy?: boolean
}

export interface McpManagerObject {
  address: string
  identity: string
  lastSeenAt: string
  disabledAt: string | undefined
  disabledBy?: UserObject

  // Relations
  gateways?: McpGatewayObject[]

  // Audit
  createdAt?: string
  createdBy?: UserObject
  updatedAt?: string
  updatedBy?: UserObject
  deletedAt?: string
  deletedBy?: UserObject
}
