import type { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, ManyToOne } from 'typeorm'
import { McpServer } from '../../mcpServer'
import { Thread } from '../../thread'

@Entity({ name: 'McpServerEvent' })
export class McpServerEvent extends BaseEntity {

  /**
   * The server that this event is associated with. This is a reference to the
   * `McpServer` entity that the event pertains to. It is used to link the event
   * to the specific server instance that triggered the event.
   */
  @ManyToOne(() => McpServer, server => server.events, { nullable: false, onDelete: 'CASCADE' })
  server?: McpServer

  /**
   * The origin of the event. This field indicates where the event originated from,
   * such as the MCP server itself, a thread, or a specific operation.
   */
  @Column('varchar', { nullable: false })
  origin: 'operation' | 'server' | 'thread'

  /**
   * The data associated with the event. This field can contain any relevant information
   * related to the event, such as status updates, error messages, or other details.
   * It is stored as a JSON string to allow for flexible data structures.
   */
  @Column('text', { transformer: transformerJson })
  data: JSONRPCMessage

  /**
   * Optionally, the thread associated with the event. This field is used to link the event
   * to a specific thread if applicable. It can be null if the event is not related to a thread.
   */
  @ManyToOne(() => Thread, thread => thread.events, { nullable: true })
  thread?: null | Thread
}
