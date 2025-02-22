import { BaseEntity, transformerDate } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { User, UserObject } from '../../user'

@Entity({ name: 'ThreadRunner' })
@Index(['address', 'deletedAt'], { unique: true })
export class ThreadRunner extends BaseEntity {

  /**
   * The base URL of the thread runner. This URL is used to make requests to
   * the thread runner and must be unique across all runners. It is used to
   * identify which runner is responsible for running specific threads.
   *
   * @example "localhost:3000"
   */
  @Column('varchar')
  address: string

  /**
   * The identity of the thread runner. This identity is given by the thread
   * runner when it is claimed by the API. This identity is used to identify
   * the thread runner and should be unique across all runners.
   *
   * @example "runner-eu-west-1-1"
   */
  @Column('varchar')
  identity: string

  /**
   * The unique token used to authenticate the thread runner. This token is
   * provided by the thread runner when it is claimed by the API. This token
   * is used to make authenticated requests to the thread runner.
   *
   * @example "00000000-0000-0000-0000-000000000000"
   */
  @Column('varchar')
  token: string

  /**
   * The last time the thread runner was pinged. This is used to determine if
   * the thread runner is still alive and responding to requests. If the thread
   * runner does not respond to a ping request within a certain time frame, it
   * is considered dead and will be removed from the list of active runners.
   */
  @Column('varchar', { transformer: transformerDate })
  lastSeenAt: Date

  /**
   * The user responsible for registering the thread runner. This user must be
   * a super administrator in order to register a thread runner. This is used
   * to ensure that only authorized users can register thread runners.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createdBy: undefined | User

  /**
   * @returns The serialized representation of the thread runner.
   */
  serialize(): ThreadRunnerObject {
    return {
      address: this.address,
      identity: this.identity,
      createdAt: this.createdAt.toISOString(),
      lastSeenAt: this.lastSeenAt.toISOString(),
      createdBy: this.createdBy?.serialize(),
    }
  }
}

export interface ThreadRunnerObject {
  address: string
  identity: string
  createdAt: string
  lastSeenAt: string
  createdBy: undefined | UserObject
}
