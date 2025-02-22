import { BaseEntity, transformerDate } from '@unserved/server'
import { default as DeviceDetector } from 'node-device-detector'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './User'

/**
 * A role is used to determine what a user can do in the application. For example, a
 * customer can only view the products and place orders. An employee can view the
 * products, place orders, and manage the inventory. An administrator can do everything.
 *
 * Each role has a unique name and a list of permissions. The permissions are used to
 * determine what the user can do in the application.
 */
@Entity({ name: 'UserSession' })
export class UserSession extends BaseEntity {

  /**
   * The owner of the session. It is used to determine who is using the session.
   *
   * @example User { ... }
   */
  @ManyToOne(() => User, user => user.sessions, { nullable: false })
  @JoinColumn()
  user: null | User

  /**
   * The address of the session. It is used to bind the session to a specific device.
   *
   * @example '192.168.1.1'
   */
  @Column('varchar')
  address: string

  /**
   * The user agent of the session. It is used to determine the device and browser
   * that the user is using to access the application.
   *
   * @example 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
   */
  @Column('varchar')
  userAgent: string

  /**
   * Expiration date of the session. When the session expires, all subsequent requests
   * will be rejected and the user will have to login again. By default, the session
   * expires in 1 hour.
   *
   * @example '2022-12-31T23:59:59.999Z'
   */
  @Column('varchar', { transformer: transformerDate })
  expiresAt: Date

  /**
   * The last time the session was used. It is used to determine if the session is still
   * active or not.
   *
   * @example '2022-12-31T23:59:59.999Z'
   */
  @Column('varchar', { transformer: transformerDate })
  lastUsedAt = new Date()

  /**
   * Parse the user agent and extract the device information.
   *
   * @returns The device information of the session.
   */
  get device(): UserSessionDevice {
    const deviceDetector = new DeviceDetector()
    const { os, client, device } = deviceDetector.detect(this.userAgent)
    return {
      os: os.name,
      browser: client.name,
      device: [device.brand, device.model].filter(Boolean).join(' '),
    }
  }

  /**
   * @returns The serialized object of the entity.
   */
  serialize(): UserSessionObject {
    return {
      ...this.device,
      address: this.address,
      lastUsedAt: this.lastUsedAt.toISOString(),
    }
  }
}

export interface UserSessionDevice {
  os: string
  device: string
  browser: string
}

export interface UserSessionObject extends UserSessionDevice {
  address: string
  lastUsedAt: string
}
