import type { RunnerStatus } from '@nwrx/nano-runner'
import type { ModuleRunner } from '..'
import { createWebSocketRoute } from '@unserved/server'
import { assert, createParser, createRuleSet } from '@unshared/validation'
import { ModuleUser } from '../../user'

// Same thing but as a websocket that polls every 5 seconds
export function runnerStatusSession(this: ModuleRunner) {
  return createWebSocketRoute(
    {
      name: 'WS /ws/runners/:identity',
      parseParameters: createParser({
        identity: assert.stringNotEmpty,
      }),
      parseServerMessage: createRuleSet([
        assert.object as (value: unknown) => asserts value is RunnerStatus,
      ]),
    },
    {
      onOpen: async({ peer, parameters }) => {
        const moduleUser = this.getModule(ModuleUser)
        const { user } = await moduleUser.authenticate(peer)
        if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

        // --- Retrieve the thread runner from the database.
        const { identity } = parameters
        const { Runner } = this.getRepositories()
        const runner = await Runner.findOneBy({ identity })
        if (!runner) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)
        const runnerClient = this.runnerClients.get(runner.id)
        if (!runnerClient) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)

        // --- Subscribe to the thread runner status.
        runnerClient.subscribe(peer)
      },
      onClose: ({ peer, parameters }) => {
        const { identity } = parameters
        const runnerClient = this.runnerClients.get(identity)
        if (!runnerClient) return
        runnerClient.unsubscribe(peer)
      },
    },
  )
}
