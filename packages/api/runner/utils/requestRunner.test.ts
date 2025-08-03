import type { RunnerClient } from './createRunnerClient'
import { type Context, createTestContext } from '../../__fixtures__'
import { requestRunner } from './requestRunner'

function createMockRunner(cpuUsage: { user: number; system: number }) {
  return {
    getStatus: () => Promise.resolve({ workerPool: [{ cpuUsage }] }),
  } as unknown as RunnerClient
}

describe<Context>('requestRunner', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('selection', (it) => {
    it('should select the runner with lowest CPU load', async({ moduleRunner }) => {
      // Create multiple runners with different loads
      const runner1 = createMockRunner({ user: 10, system: 5 })
      const runner2 = createMockRunner({ user: 5, system: 10 })
      const runner3 = createMockRunner({ user: 15, system: 15 })
      moduleRunner.runnerClients.set('runner1', runner1)
      moduleRunner.runnerClients.set('runner2', runner2)
      moduleRunner.runnerClients.set('runner3', runner3)
      const selectedRunner = await requestRunner.call(moduleRunner)
      expect(selectedRunner).toBe(runner2)
    })

    it('should select last runner when all have same load', async({ moduleRunner }) => {
      const runner1 = createMockRunner({ user: 10, system: 10 })
      const runner2 = createMockRunner({ user: 10, system: 10 })
      moduleRunner.runnerClients.set('runner1', runner1)
      moduleRunner.runnerClients.set('runner2', runner2)
      const selectedRunner = await requestRunner.call(moduleRunner)
      expect(selectedRunner).toBe(runner2)
    })

    it('should throw when a runner is not available', async({ moduleRunner }) => {
      const shouldReject = requestRunner.call(moduleRunner)
      const error = moduleRunner.errors.THREAD_RUNNER_NO_RUNNERS_AVAILABLE()
      await expect(shouldReject).rejects.toThrow(error)
    })
  })
})
