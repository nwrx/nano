import type { ThreadServerMessage } from '@nwrx/nano-runner'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Runner } from '../../runner'
import { Thread } from './Thread'

@Entity({ name: 'ThreadEvent' })
export class ThreadEvent extends BaseEntity {

  /**
   * The index of the event in the thread's event history. This is used to
   * maintain the order of events and to allow for efficient retrieval of
   * events in the thread's history.
   */
  @Column('int')
  index: number

  /**
   * The thread that this event belongs to. This is used to track the history
   * of events that occurred in a thread and to reconstruct the thread state.
   *
   * @example Thread { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Thread, run => run.events, { nullable: false, onDelete: 'CASCADE' })
  thread?: Thread

  /**
   * The thread runner that processed this event. This is used to track which
   * runner was responsible for executing the event. Since a thread can be
   * interrupted and resumed on a different runner, we track this at the event level.
   *
   * @example Runner { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Runner, { nullable: true, onDelete: 'SET NULL' })
  runner?: null | Runner

  /**
   * The data associated with the event. This contains event-specific information
   * that varies depending on the event type.
   *
   * @example { event: 'nodeStarted', data: [{ nodeId: '123', inputs: { ... } }] }
   */
  @Column('json', { default: '{}', transformer: transformerJson })
  message: ThreadServerMessage

  /**
   * @returns The serialized representation of the thread event.
   */
  serialize(): ThreadEventObject {
    return {
      index: this.index,
      message: this.message,
      createdAt: this.createdAt.toISOString(),
    }
  }
}

export interface ThreadEventObject {
  index: number
  message: ThreadServerMessage
  createdAt: string
}
