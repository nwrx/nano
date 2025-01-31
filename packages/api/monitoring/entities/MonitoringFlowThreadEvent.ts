import type { ObjectLike } from '@unshared/types'
import { ThreadEvents } from '@nwrx/nano'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { MonitoringFlowThread } from './MonitoringFlowThread'

/**
 * A `FlowThreadEvent` is used to log the events that occurred during the execution
 * of a flow. It is used to store the information about the event such as the
 * type, message, etc.
 */
@Entity({ name: 'MonitoringFlowThreadEvent' })
export class MonitoringFlowThreadEvent extends BaseEntity {

  /**
   * The type of the event. It is used to determine the action that was performed
   * during the flow run.
   *
   * @example 'start'
   */
  @Column('varchar', { length: 255 })
  event: keyof ThreadEvents

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
  @ManyToOne(() => MonitoringFlowThread, run => run.events, { nullable: false, onDelete: 'CASCADE' })
  thread: MonitoringFlowThread

  /**
   * @returns The object representation of the event.
   */
  serialize(): MonitoringFlowThreadEventObject {
    return {
      id: this.id,
      event: this.event,
      data: this.data,
      delta: this.delta,
      timestamp: this.timestamp,
      createdAt: this.createdAt.toISOString(),
    }
  }
}

export interface MonitoringFlowThreadEventObject {
  id: string
  event: keyof ThreadEvents
  data: ObjectLike
  delta: number
  timestamp: number
  createdAt: string
}
