import { BaseEntity } from '@unserved/server'
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { User, UserObject } from '../../user'
import { Flow, FlowObject } from './Flow'
import { FlowThreadEvent, FlowThreadEventObject } from './FlowThreadEvent'
import { FlowThreadNodeEvent, FlowThreadNodeEventObject } from './FlowThreadNodeEvent'

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
   * The node events that occurred during the flow run.
   *
   * @example [FlowThreadNodeEvent, FlowThreadNodeEvent, FlowThreadNodeEvent]
   */
  @OneToMany(() => FlowThreadNodeEvent, event => event.thread, { cascade: true })
  nodeEvents?: FlowThreadNodeEvent[]

  /**
   * The user that triggered the execution of the thread.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  createdBy?: User | null

  /**
   * @returns The object representation of the flow run.
   */
  serialize(): FlowThreadObject {
    return {
      id: this.id,
      flow: this.flow.serialize(),
      events: this.events?.map(event => event.serialize()),
      nodeEvents: this.nodeEvents?.map(event => event.serialize()),
      createdBy: this.createdBy?.serialize(),
    }
  }
}

export interface FlowThreadObject {
  id: string
  flow: FlowObject
  createdBy?: UserObject
  events?: FlowThreadEventObject[]
  nodeEvents?: FlowThreadNodeEventObject[]
}
