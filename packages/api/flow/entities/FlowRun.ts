import { BaseEntity } from '@unserved/server'
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { User, UserObject } from '../../user'
import { Flow, FlowObject } from './Flow'
import { FlowRunEvent } from './FlowRunEvent'

/**
 * A `FlowRun` is used to log the execution of a flow. It is used to store the
 * information about the flow run such as the start time, end time, status, etc.
 */
@Entity({ name: 'FlowRun' })
export class FlowRun extends BaseEntity {

  /**
   * The user that executed the flow.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  user?: User

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
   * @example [FlowRunEvent, FlowRunEvent, FlowRunEvent]
   */
  @OneToMany(() => FlowRunEvent, event => event.run, { cascade: true })
  events?: FlowRunEvent[]

  /**
   * @returns The object representation of the flow run.
   */
  serialize(): FlowRunObject {
    return {
      id: this.id,
      flow: this.flow.serialize(),
      user: this.user?.serialize(),
    }
  }
}

export interface FlowRunObject {
  id: string
  flow: FlowObject
  user?: UserObject
}
