import { ThreadEventMap } from '@nwrx/nano'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { ThreadRunner, ThreadRunnerObject } from '../../threadRunner'
import { Thread } from './Thread'

@Entity({ name: 'ThreadEvent' })
export class ThreadEvent<T extends keyof ThreadEventMap = keyof ThreadEventMap> extends BaseEntity {

  /**
   * The thread that this event belongs to. This is used to track the history
   * of events that occurred in a thread and to reconstruct the thread state.
   *
   * @example Thread { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Thread, run => run.events, { nullable: false, onDelete: 'RESTRICT' })
  thread: Thread | undefined

  /**
   * The thread runner that processed this event. This is used to track which
   * runner was responsible for executing the event. Since a thread can be
   * interrupted and resumed on a different runner, we track this at the event level.
   *
   * @example ThreadRunner { ... }
   */
  @JoinColumn()
  @ManyToOne(() => ThreadRunner, { nullable: false, onDelete: 'SET NULL' })
  runner: ThreadRunner | undefined

  /**
   * The type of event that occurred. This is used to determine how to handle
   * the event data and what actions to take based on the event type.
   *
   * @example "nodeStarted" | "nodeCompleted" | "nodeFailed"
   */
  @Column('varchar', { length: 255 })
  event: T

  /**
   * The data associated with the event. This contains event-specific information
   * that varies depending on the event type.
   *
   * @example { nodeId: "start", input: { ... }, output: { ... } }
   */
  @Column('json', { default: '{}', transformer: transformerJson })
  data: ThreadEventMap[T]

  /**
   * @returns The serialized representation of the thread event.
   */
  serialize(): ThreadEventObject {
    return {
      event: this.event,
      data: this.data,
      runner: this.runner?.serialize(),
      createdAt: this.createdAt.toISOString(),
    }
  }
}

export interface ThreadEventObject<T extends keyof ThreadEventMap = keyof ThreadEventMap> {
  event: T
  data: ThreadEventMap[T]
  runner?: ThreadRunnerObject
  createdAt: string
}
