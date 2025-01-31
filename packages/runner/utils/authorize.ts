import type { H3Event } from 'h3'
import type { ModuleRunner } from '..'
import { getEventInformation } from './getEventInformation'

export function authorize(this: ModuleRunner, event: H3Event) {
  const { token, address } = getEventInformation.call(this, event)
  if (token !== this.runnerToken) throw this.errors.NOT_AUTHORIZED()
  if (address !== this.runnerMasterAddress) throw this.errors.NOT_AUTHORIZED()
}
