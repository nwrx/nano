import { FlowThreadNodeEvents } from '@nwrx/core'
import { BaseEntity, transformerDate, transformerJson } from '@unserved/server'
import { ObjectLike } from '@unshared/types'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { FlowThread } from './FlowThread'

/**
 * A `FlowThreadNodeEvent` is used to log the events that occurred during the
 * execution of a flow node. It is used to store the information about the event
 * such as the type, message, etc.
 */
@Entity({ name: 'FlowThreadNodeEvent' })
export class FlowThreadNodeEvent extends BaseEntity {

  /**
   * The type of the event. It is used to determine the action that was performed
   * during the flow run.
   *
   * @example 'start'
   */
  @Column('varchar', { length: 255 })
  event: keyof FlowThreadNodeEvents

  /**
   * The ID of the node in the flow. It is used to determine the node that the event
   * was triggered on.
   */
  @Column('varchar', { length: 255 })
  node: string

  /**
   * The kind of the node that the event is associated with. It is used to determine
   * the type of the node that the event was triggered on.
   */
  @Column('varchar', { length: 255 })
  kind: string

  /**
   * The duration of the event. It is used to determine the time taken to perform
   * a non-blocking action.
   */
  @Column('int', { default: 0 })
  duration: number

  /**
   * The timestamp when the event occurred. It is used to determine the time when
   * the event was triggered.
   */
  @Column('varchar', { length: 255, nullable: true, transformer: transformerDate })
  timestamp?: Date

  /**
   * The delta since the start of the thread. It is used to determine the time
   * difference between the events.
   */
  @Column('int')
  delta: number

  /**
   * The data associated with the event. It is used to store the details of the
   * event such as the message, payload, etc.
   *
   * @example { message: 'Flow started' }
   */
  @Column('json', { default: '{}', transformer: transformerJson })
  data: ObjectLike

  /**
   * The flow run that the event is part of.
   *
   * @example FlowSession { ... }
   */
  @JoinColumn()
  @ManyToOne(() => FlowThread, thread => thread.nodeEvents, { nullable: false, onDelete: 'CASCADE' })
  thread: FlowThread

  /**
   * @returns The object representation of the event.
   */
  serialize() {
    return {
      event: this.event,
      kind: this.kind,
      duration: this.duration,
      timestamp: this.timestamp,
      delta: this.delta,
      data: this.data,
    }
  }
}

export interface FlowThreadNodeEventObject {
  event: keyof FlowThreadNodeEvents
  kind: string
  duration: number
  timestamp?: Date
  delta: number
  data: ObjectLike
}
