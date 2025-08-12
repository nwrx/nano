import type { FlowV1 } from '@nwrx/nano'
import { BaseEntity, transformerJson } from '@unserved/server'
import { UUID } from 'node:crypto'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Flow } from '../../flow'
import { User, UserObject } from '../../user'
import { ThreadEvent, ThreadEventObject } from './ThreadEvent'

@Entity({ name: 'Thread' })
export class Thread extends BaseEntity {

  /**
   * The flow that the thread is part of. This is used to reference the flow
   * from which the flow specific data is taken from. Since the flow can change
   * over time, the flow data is also stored in the thread.
   *
   * @example Flow { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Flow, { nullable: false, onDelete: 'RESTRICT' })
  flow?: Flow

  /**
   * The data of the flow at the time the thread was created. Since the flow can
   * change over time, this property represents the source of truth for the flow
   * data at the time the thread was created.
   *
   * @example { version: '1', nodes: {}, metadata: {} }
   */
  @Column('text', { transformer: transformerJson })
  data: FlowV1

  /**
   * The events that occurred in the thread. This can be used to track the flow
   * behavior and restore the flow to a previous state if needed.
   *
   * @example [ThreadEvent { ... }]
   */
  @OneToMany(() => ThreadEvent, event => event.thread, { cascade: true })
  events?: ThreadEvent[]

  /**
   * The user that created the thread.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy?: User

  /**
   * The user that last updated the thread.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updatedBy?: null | User

  /**
   * The user responsible for deleting the thread.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  deletedBy?: null | User

  /**
   * @param options Options to control serialization.
   * @returns The serialize representation of the thread.
   */
  serialize(options: SerializeOptions = {}): ThreadObject {
    const {
      withEvents = false,
      withCreatedBy = true,
      withUpdatedBy = false,
      withDeleted = false,
    } = options
    return {
      id: this.id,
      events: withEvents ? this.events?.map(event => event.serialize()) : undefined,

      // Metadata
      createdAt: withCreatedBy ? this.createdAt?.toISOString() : undefined,
      createdBy: withCreatedBy ? this.createdBy?.serialize() : undefined,
      updatedAt: withUpdatedBy ? this.updatedAt?.toISOString() : undefined,
      updatedBy: withUpdatedBy ? this.updatedBy?.serialize() : undefined,
      deletedAt: withDeleted ? this.deletedAt?.toISOString() : undefined,
      deletedBy: withDeleted ? this.deletedBy?.serialize() : undefined,
    }
  }
}

interface SerializeOptions {
  withEvents?: boolean
  withCreatedBy?: boolean
  withUpdatedBy?: boolean
  withDeleted?: boolean
}

export interface ThreadObject {
  id: UUID
  events?: ThreadEventObject[]

  // Metadata
  createdAt?: string
  createdBy?: UserObject
  updatedAt?: string
  updatedBy?: UserObject
  deletedAt?: string
  deletedBy?: UserObject
}
