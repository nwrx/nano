import { BaseEntity } from '@unserved/server'
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Flow } from '../../flow'
import { User, UserObject } from '../../user'
import { MonitoringFlowThreadEvent } from './MonitoringFlowThreadEvent'
import { MonitoringFlowThreadNodeEvent, MonitoringFlowThreadNodeEventObject } from './MonitoringFlowThreadNodeEvent'

/**
 * A `MonitoringFlowThread` is used to log the execution of a flow. It is used to store the
 * information about the flow run such as the start time, end time, status, etc.
 */
@Entity({ name: 'MonitoringFlowThread' })
export class MonitoringFlowThread extends BaseEntity {

  /**
   * The flow that was executed.
   *
   * @example Flow { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Flow, { onDelete: 'CASCADE' })
  flow: Flow

  /**
   * The events that occurred during the flow run.
   *
   * @example [MonitoringFlowThreadEvent, ...]
   */
  @OneToMany(() => MonitoringFlowThreadEvent, event => event.thread, { cascade: true })
  events?: MonitoringFlowThreadEvent[]

  /**
   * The node events that occurred during the flow run.
   *
   * @example [FlowThreadNodeEvent, ...]
   */
  @OneToMany(() => MonitoringFlowThreadNodeEvent, event => event.thread, { cascade: true })
  nodeEvents?: MonitoringFlowThreadNodeEvent[]

  /**
   * The user that triggered the execution of the thread.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  createdBy?: null | User

  /**
   * @returns The object representation of the flow run.
   */
  serialize(): MonitoringFlowThreadObject {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      createdBy: this.createdBy?.serialize(),
      events: this.events?.map(event => event.serialize()),
      nodeEvents: this.nodeEvents?.map(event => event.serialize()),
    }
  }
}

export interface MonitoringFlowThreadObject {
  id: string
  createdBy?: UserObject
  createdAt: string
  events?: MonitoringFlowThreadObject[]
  nodeEvents?: MonitoringFlowThreadNodeEventObject[]
}
