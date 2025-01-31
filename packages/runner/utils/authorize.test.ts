import type { TestApplication } from '@unserved/server'
import { createTestApplication, createTestEvent, createTestPeer } from '@unserved/server'
import { ModuleRunner } from '..'
import { authorize } from './authorize'

interface Context {
  application: TestApplication<ModuleRunner>
  moduleRunner: ModuleRunner
}

describe.concurrent<Context>('getEventInformation', () => {
  beforeEach<Context>(async(context) => {
    context.application = await createTestApplication([ModuleRunner])
    context.moduleRunner = context.application.getModule(ModuleRunner)
    await context.application.createTestServer()
  })

  afterEach<Context>(async({ application }) => {
    await application.destroy()
  })

  describe<Context>('with event', (it) => {
    it('should authorize the event when the token and address are valid with "runnerTrustProxy" set to true', ({ moduleRunner }) => {
      moduleRunner.runnerTrustProxy = true
      const event = createTestEvent({
        headers: {
          'authorization': `Bearer ${moduleRunner.runnerToken}`,
          'x-forwarded-for': moduleRunner.runnerMasterAddress,
        },
      })
      const result = authorize.call(moduleRunner, event)
      expect(result).toBeUndefined()
    })

    it('should authorize the event when the token and address are valid with "runnerTrustProxy" set to false', ({ moduleRunner }) => {
      const event = createTestEvent({
        headers: { authorization: `Bearer ${moduleRunner.runnerToken}` },
        remoteAddress: moduleRunner.runnerMasterAddress,
      })
      const result = authorize.call(moduleRunner, event)
      expect(result).toBeUndefined()
    })

    it('should throw an error when the token is invalid', ({ moduleRunner }) => {
      const event = createTestEvent({
        headers: { authorization: 'Bearer invalid' },
        remoteAddress: moduleRunner.runnerMasterAddress,
      })
      const shouldThrow = () => authorize.call(moduleRunner, event)
      const error = moduleRunner.errors.NOT_AUTHORIZED()
      expect(shouldThrow).toThrowError(error)
    })

    it('should throw an error when the address is invalid', ({ moduleRunner }) => {
      const event = createTestEvent({
        headers: { authorization: `Bearer ${moduleRunner.runnerToken}` },
        remoteAddress: '0.0.0.0',
      })
      const shouldThrow = () => authorize.call(moduleRunner, event)
      const error = moduleRunner.errors.NOT_AUTHORIZED()
      expect(shouldThrow).toThrowError(error)
    })
  })

  describe<Context>('with peer', (it) => {
    it('should authorize the peer when the token and address are valid with "runnerTrustProxy" set to true', ({ moduleRunner }) => {
      moduleRunner.runnerTrustProxy = true
      const peer = createTestPeer({
        headers: {
          'authorization': `Bearer ${moduleRunner.runnerToken}`,
          'x-forwarded-for': moduleRunner.runnerMasterAddress,
        },
      })
      const result = authorize.call(moduleRunner, peer)
      expect(result).toBeUndefined()
    })

    it('should authorize the peer when the token and address are valid with "runnerTrustProxy" set to false', ({ moduleRunner }) => {
      const peer = createTestPeer({
        headers: { authorization: `Bearer ${moduleRunner.runnerToken}` },
        remoteAddress: moduleRunner.runnerMasterAddress,
      })
      const result = authorize.call(moduleRunner, peer)
      expect(result).toBeUndefined()
    })

    it('should throw an error when the token is invalid', ({ moduleRunner }) => {
      const peer = createTestPeer({
        headers: { authorization: 'Bearer invalid' },
        remoteAddress: moduleRunner.runnerMasterAddress,
      })
      const shouldThrow = () => authorize.call(moduleRunner, peer)
      const error = moduleRunner.errors.NOT_AUTHORIZED()
      expect(shouldThrow).toThrowError(error)
    })

    it('should throw an error when the address is invalid', ({ moduleRunner }) => {
      const peer = createTestPeer({
        headers: { authorization: `Bearer ${moduleRunner.runnerToken}` },
        remoteAddress: '0.0.0.0',
      })
      const shouldThrow = () => authorize.call(moduleRunner, peer)
      const error = moduleRunner.errors.NOT_AUTHORIZED()
      expect(shouldThrow).toThrowError(error)
    })
  })
})
