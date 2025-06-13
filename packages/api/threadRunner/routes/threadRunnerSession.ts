import type { ThreadRunnerStatus } from '@nwrx/nano-runner'
import type { ModuleThreadRunner } from '..'
import { createWebSocketRoute } from '@unserved/server'
import { assert, createRuleSet, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'

// Same thing but as a websocket that polls every 5 seconds
export function threadRunnerStatusSession(this: ModuleThreadRunner) {
  return createWebSocketRoute(
    {
      name: 'WS /ws/runners/:identity',
      parseParameters: createParser({
        identity: assert.stringNotEmpty,
      }),
      parseServerMessage: createRuleSet([assert.object as (value: unknown) => asserts value is ThreadRunnerStatus]),
    },
    {
      onOpen: async({ peer, parameters }) => {
        const moduleUser = this.getModule(ModuleUser)
        const { user } = await moduleUser.authenticate(peer)
        if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

        // --- Retrieve the thread runner from the database.
        const { identity } = parameters
        const { ThreadRunner } = this.getRepositories()
        const threadRunner = await ThreadRunner.findOneBy({ identity })
        if (!threadRunner) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)
        const threadRunnerClient = this.threadRunners.get(threadRunner.id)
        if (!threadRunnerClient) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)

        // --- Subscribe to the thread runner status.
        threadRunnerClient.subscribe(peer)
      },
      onClose: ({ peer, parameters }) => {
        const { identity } = parameters
        const threadRunnerClient = this.threadRunners.get(identity)
        if (!threadRunnerClient) return
        threadRunnerClient.unsubscribe(peer)
      },
    },
  )
}
