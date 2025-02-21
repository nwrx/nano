import type { Peer } from 'crossws'
import type { H3Event } from 'h3'
import type { ModuleRunner } from '../application'
import { getEventInformation } from './getEventInformation'

export function authorize(this: ModuleRunner, event: H3Event | Peer) {
  const { token, address } = getEventInformation.call(this, event)
  if (token !== this.runnerToken) throw this.errors.UNAUTHORIZED()
  if (address !== this.runnerMasterAddress) throw this.errors.UNAUTHORIZED()
}
