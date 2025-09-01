/* eslint-disable unicorn/no-null */
import { BaseEntity, transformerDate } from '@unserved/server'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { User, UserObject } from '../../user'

@Entity({ name: 'Runner' })
@Index(['address', 'deletedAt'], { unique: true })
export class Runner extends BaseEntity {

  /**
   * Flag to indicate if the runner was registered via the initialization of the
   * application using the `NANO_RUNNER_INITIAL_SERVERS` environment variable. This will determine
   * if the runner can be removed from the database when not in `NANO_RUNNER_INITIAL_SERVERS` anymore.
   */
  @Column('boolean', { default: false })
  isInitial = false

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
   * The name of the thread runner. This name is given by the thread
   * runner when it is claimed by the API. This  is used to identify
   * the thread runner and should be unique across all runners.
   *
   * @example "runner-eu-west-1-1"
   */
  @Column('varchar')
  name: string

  /**
   * The unique token used to authenticate the thread runner. This token is
   * provided by the thread runner when it is claimed by the API. This token
   * is used to make authenticated requests to the thread runner.
   *
   * @example "abcd1234efgh5678ijkl9012mnop3456"
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
  lastSeenAt?: Date

  /**
   * The date and time when the runner was disabled. Also acts as a
   * flag to indicate if the runner is disabled.
   */
  @Column('varchar', { nullable: true, transformer: transformerDate })
  disabledAt: Date | null

  /**
   * The user responsible for disabling the runner.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  disabledBy?: null | User

  /**
   * The user that created the runner.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  createdBy?: null | User

  /**
   * The user that last updated the runner.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updatedBy?: null | User

  /**
   * The user responsible for deleting the runner.
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  deletedBy?: null | User

  /**
   * @param options The options to use when serializing the runner.
   * @returns The serialized representation of the thread runner.
   */
  serialize(options: SerializeOptions = {}): RunnerObject {
    const {
      withCreatedBy = false,
      withUpdatedBy = false,
      withDisabledBy = false,
      withDeleted = false,
    } = options
    return {
      name: this.name,
      address: this.address,
      lastSeenAt: this.lastSeenAt?.toISOString(),
      disabledAt: this.disabledAt ? this.disabledAt.toISOString() : null,
      disabledBy: withDisabledBy ? this.disabledBy?.serialize() : undefined,

      // Metadata
      createdAt: withCreatedBy ? this.createdAt.toISOString() : undefined,
      createdBy: withCreatedBy ? this.createdBy?.serialize() : undefined,
      updatedAt: withUpdatedBy ? this.updatedAt.toISOString() : undefined,
      updatedBy: withUpdatedBy ? this.updatedBy?.serialize() : undefined,
      deletedAt: withDeleted ? this.deletedAt?.toISOString() : undefined,
      deletedBy: withDeleted ? this.deletedBy?.serialize() : undefined,
    }
  }
}

interface SerializeOptions {
  withCreatedBy?: boolean
  withUpdatedBy?: boolean
  withDisabledBy?: boolean
  withDeleted?: boolean
}

export interface RunnerObject {
  name: string
  address: string
  lastSeenAt?: string
  disabledAt: null | string
  disabledBy?: UserObject

  // Metadata
  createdAt?: string
  createdBy?: UserObject
  updatedAt?: string
  updatedBy?: UserObject
  deletedAt?: string
  deletedBy?: UserObject
}
