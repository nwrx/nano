import type { FlowV1 } from '@nwrx/nano'
import { BaseEntity, transformerJson } from '@unserved/server'
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
  flow: Flow | undefined

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
   * The user that created the thread. This is used to determine who created the
   * thread and who has the permission to view and modify the thread.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  createdBy: undefined | User

  /**
   * The events that occurred in the thread. This can be used to track the flow
   * behavior and restore the flow to a previous state if needed.
   *
   * @example [ThreadEvent { ... }]
   */
  @OneToMany(() => ThreadEvent, event => event.thread, { cascade: true })
  events: ThreadEvent[] | undefined

  /**
   * @returns The serialize representation of the thread.
   */
  serialize(): ThreadObject {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      createdBy: this.createdBy?.serialize(),
      events: this.events?.map(event => event.serialize()),
    }
  }
}

export interface ThreadObject {
  id: string
  createdAt: string
  createdBy?: UserObject
  events?: ThreadEventObject[]
}
