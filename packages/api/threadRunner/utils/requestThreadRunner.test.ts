import type { ThreadRunnerClient } from './createThreadRunner'
import { type Context, createTestContext } from '../../__fixtures__'
import { requestThreadRunner } from './requestThreadRunner'

function createMockThreadRunner(cpuUsage: { user: number; system: number }) {
  return {
    getStatus: () => Promise.resolve({ workerPool: [{ cpuUsage }] }),
  } as unknown as ThreadRunnerClient
}

describe<Context>('requestThreadRunner', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('selection', (it) => {
    it('should select the runner with lowest CPU load', async({ moduleThreadRunner }) => {
      // Create multiple runners with different loads
      const runner1 = createMockThreadRunner({ user: 10, system: 5 })
      const runner2 = createMockThreadRunner({ user: 5, system: 10 })
      const runner3 = createMockThreadRunner({ user: 15, system: 15 })
      moduleThreadRunner.threadRunners.set('runner1', runner1)
      moduleThreadRunner.threadRunners.set('runner2', runner2)
      moduleThreadRunner.threadRunners.set('runner3', runner3)
      const selectedRunner = await requestThreadRunner.call(moduleThreadRunner)
      expect(selectedRunner).toBe(runner2)
    })

    it('should select last runner when all have same load', async({ moduleThreadRunner }) => {
      const runner1 = createMockThreadRunner({ user: 10, system: 10 })
      const runner2 = createMockThreadRunner({ user: 10, system: 10 })
      moduleThreadRunner.threadRunners.set('runner1', runner1)
      moduleThreadRunner.threadRunners.set('runner2', runner2)
      const selectedRunner = await requestThreadRunner.call(moduleThreadRunner)
      expect(selectedRunner).toBe(runner2)
    })

    it('should throw when a runner is not available', async({ moduleThreadRunner }) => {
      const shouldReject = requestThreadRunner.call(moduleThreadRunner)
      const error = moduleThreadRunner.errors.THREAD_RUNNER_NO_RUNNERS_AVAILABLE()
      await expect(shouldReject).rejects.toThrow(error)
    })
  })
})
