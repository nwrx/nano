import { BaseEntity } from '@unserved/server'
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { UserObject } from '../../user'
import { FlowSessionEventPayload } from '../utils'
import { Flow, FlowObject } from './Flow'
import { FlowThreadEvent } from './FlowThreadEvent'

/**
 * A `FlowThread` is used to log the execution of a flow. It is used to store the
 * information about the flow run such as the start time, end time, status, etc.
 */
@Entity({ name: 'FlowThread' })
export class FlowThread extends BaseEntity {

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
   * @example [FlowThreadEvent, FlowThreadEvent, FlowThreadEvent]
   */
  @OneToMany(() => FlowThreadEvent, event => event.thread, { cascade: true })
  events?: FlowThreadEvent[]

  /**
   * @returns The object representation of the flow run.
   */
  serialize(): FlowThreadObject {
    return {
      id: this.id,
      flow: this.flow.serialize(),
      events: this.events?.map(event => event.serialize()),
    }
  }
}

export interface FlowThreadObject {
  id: string
  flow: FlowObject
  user?: UserObject
  events?: FlowSessionEventPayload[]
}
