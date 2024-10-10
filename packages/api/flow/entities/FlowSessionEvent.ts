import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from '../../user'
import { FlowSessionEventMap, FlowSessionEventName } from '../utils'
import { FlowSession } from './FlowSession'

/**
 * A `FlowSessionEvent` is used to log the events that occurred during the execution
 * of a flow. It is used to store the information about the event such as the
 * type, message, etc.
 */
@Entity({ name: 'FlowSessionEvent' })
export class FlowSessionEvent<T extends FlowSessionEventName = FlowSessionEventName> extends BaseEntity {

  /**
   * The type of the event. It is used to determine the action that was performed
   * during the flow run.
   *
   * @example 'flow:start'
   */
  @Column('varchar', { length: 255 })
  event: T

  /**
   * The data associated with the event. It is used to store the details of the
   * event such as the message, payload, etc.
   *
   * @example { message: 'Flow started' }
   */
  @Column('json', { default: '{}', transformer: transformerJson })
  data: FlowSessionEventMap[T]

  /**
   * The flow run that the event is part of.
   *
   * @example FlowSession { ... }
   */
  @JoinColumn()
  @ManyToOne(() => FlowSession, run => run.events, { nullable: false, onDelete: 'CASCADE' })
  session: FlowSession

  /**
   * The user responsible for the event. It is used to determine the user that
   * acted on the flow session. It can be null if the event was not triggered by
   * a user.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  user?: User | null

  /**
   * @returns The object representation of the event.
   */
  serialize(): FlowSessionEventObject {
    return {
      id: this.id,
      event: this.event,
      data: this.data,
    }
  }
}

export interface FlowSessionEventObject<T extends FlowSessionEventName = FlowSessionEventName> {
  id: string
  event: T
  data: FlowSessionEventMap[T]
}
