import type { ModuleRunner } from '../module'
import { createHttpRoute } from '@unserved/server'
import { getRequestHeader, getRequestIP } from 'h3'

export function claim(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'POST /claim',
    },
    ({ event }) => {
      if (this.runnerIsClaimed) throw this.errors.RUNNER_ALREADY_CLAIMED()

      // --- Claim the runner and assign the request's remote address as the master address.
      const address = this.runnerTrustProxy ? getRequestHeader(event, 'X-Forwarded-For') : getRequestIP(event)
      if (!address) throw this.errors.NOT_AUTHORIZED()
      this.runnerIsClaimed = true
      this.runnerMasterAddress = address

      // --- Respond with the token.
      return { token: this.runnerToken }
    },
  )
}
