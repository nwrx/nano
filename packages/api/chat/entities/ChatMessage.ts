import type { ChatMessageData } from '../utils'
import { BaseEntity, transformerJson } from '@unserved/server'
import { UUID } from 'node:crypto'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { ChatThread } from './Chat'

/**
 * A `ChatMessage` represents a message sent or received by a `Chat` thread.
 */
@Entity({ name: 'ChatMessage' })
export class ChatMessage extends BaseEntity {

  /**
   * The content of the message.
   *
   * @example 'Start flow execution'
   */
  @Column('text', { transformer: transformerJson })
  data: ChatMessageData

  /**
   * The flow thread that the message belongs to.
   *
   * @example Chat { ... }
   */
  @JoinColumn()
  @ManyToOne(() => ChatThread, chat => chat.messages, { onDelete: 'CASCADE' })
  chat: ChatThread

  /** @returns The serialized representation of the flow thread message. */
  serialize(): ChatMessageObject {
    return {
      id: this.id,
      data: this.data,
      createdAt: this.createdAt.toUTCString(),
    }
  }
}

export interface ChatMessageObject {
  id: UUID
  data: ChatMessageData
  createdAt: string
}
