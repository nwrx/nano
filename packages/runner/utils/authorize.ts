import type { Peer } from 'crossws'
import type { H3Event } from 'h3'
import type { ModuleRunner } from '../module'
import { getEventInformation } from './getEventInformation'

export function authorize(this: ModuleRunner, event: H3Event | Peer) {
  const { token, address } = getEventInformation.call(this, event)
  if (token !== this.runnerToken) throw this.errors.NOT_AUTHORIZED()
  if (address !== this.runnerMasterAddress) throw this.errors.NOT_AUTHORIZED()
}
