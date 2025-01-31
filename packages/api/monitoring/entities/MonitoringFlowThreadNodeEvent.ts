import type { ObjectLike } from '@unshared/types'
import { FlowThreadNodeEvents } from '@nwrx/nano'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { MonitoringFlowThread } from './MonitoringFlowThread'

/**
 * A `MonitoringFlowThreadNodeEvent` is used to log the events that occurred during the
 * execution of a flow node. It is used to store the information about the event
 * such as the type, message, etc.
 */
@Entity({ name: 'MonitoringFlowThreadNodeEvent' })
export class MonitoringFlowThreadNodeEvent extends BaseEntity {

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
  @Column('int')
  duration: number

  /**
   * The timestamp when the event occurred. It is used to determine the time when
   * the event was triggered.
   */
  @Column('bigint')
  timestamp: number

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
  @ManyToOne(() => MonitoringFlowThread, thread => thread.nodeEvents, { nullable: false, onDelete: 'CASCADE' })
  thread: MonitoringFlowThread

  /**
   * @returns The object representation of the event.
   */
  serialize(): MonitoringFlowThreadNodeEventObject {
    return {
      id: this.id,
      event: this.event,
      node: this.node,
      kind: this.kind,
      data: this.data,
      delta: this.delta,
      duration: this.duration,
      timestamp: this.timestamp,
      createdAt: this.createdAt.toISOString(),
    }
  }
}

export interface MonitoringFlowThreadNodeEventObject {
  id: string
  event: keyof FlowThreadNodeEvents
  node: string
  kind: string
  data: ObjectLike
  delta: number
  duration: number
  timestamp: number
  createdAt: string
}
