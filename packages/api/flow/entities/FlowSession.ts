import { BaseEntity } from '@unserved/server'
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { UserObject } from '../../user'
import { FlowSessionEventPayload } from '../utils'
import { Flow, FlowObject } from './Flow'
import { FlowSessionEvent } from './FlowSessionEvent'

/**
 * A `FlowSession` is used to log the execution of a flow. It is used to store the
 * information about the flow run such as the start time, end time, status, etc.
 */
@Entity({ name: 'FlowSession' })
export class FlowSession extends BaseEntity {

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
   * @example [FlowSessionEvent, FlowSessionEvent, FlowSessionEvent]
   */
  @OneToMany(() => FlowSessionEvent, event => event.session, { cascade: true })
  events?: FlowSessionEvent[]

  /**
   * @returns The object representation of the flow run.
   */
  serialize(): FlowSessionObject {
    return {
      id: this.id,
      flow: this.flow.serialize(),
      events: this.events?.map(event => event.serialize()),
    }
  }
}

export interface FlowSessionObject {
  id: string
  flow: FlowObject
  user?: UserObject
  events?: FlowSessionEventPayload[]
}
