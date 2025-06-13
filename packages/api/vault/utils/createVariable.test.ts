/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { AssertionError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { VaultVariable } from '../entities'
import { createVariable, type CreateVariableOptions } from './createVariable'

describe('createVariable', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('result', (it) => {
    it('should create a variable', async({ setupUser, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { vault } = await setupVault()
      const options = { user, name: 'variable', value: 'value', vault }
      const variable = await createVariable.call(moduleVault, options as CreateVariableOptions)
      expect(variable).toBeInstanceOf(VaultVariable)
      expect(variable).toMatchObject({
        id: variable.id,
        name: 'variable',
        vault: { id: vault.id },
        createdBy: { id: user.id },
        data: {
          algorithm: 'aes-256-gcm',
          iv: expect.any(String),
          tag: expect.any(String),
          cipher: expect.any(String),
        },
      })
    })

    it('should not save the variable to the database', async({ setupUser, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { vault } = await setupVault()
      const options = { user, name: 'variable', value: 'value', vault }
      await createVariable.call(moduleVault, options as CreateVariableOptions)
      const count = await moduleVault.getRepositories().VaultVariable.countBy({ vault })
      expect(count).toBe(0)
    })
  })

  describe<Context>('database', (it) => {
    it('should save the variable to the database', async({ setupUser, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { vault } = await setupVault()
      const options = { user, name: 'variable', value: 'value', vault }
      const variable = await createVariable.call(moduleVault, options as CreateVariableOptions)
      await moduleVault.getRepositories().VaultVariable.save(variable)
      const found = await moduleVault.getRepositories().VaultVariable.findOneBy({ id: variable.id })
      expect(found).toMatchObject({ id: variable.id })
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw if user is missing', async({ setupVault, moduleVault }) => {
      const { vault } = await setupVault()
      const options = { name: 'variable', value: 'value', vault }
      // @ts-expect-error: testing invalid options
      const shouldThrow = createVariable.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(AssertionError)
    })

    it('should throw if name is missing', async({ setupUser, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { vault } = await setupVault()
      const options = { user, value: 'value', vault }
      // @ts-expect-error: testing invalid options
      const shouldThrow = createVariable.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(AssertionError)
    })

    it('should throw if name is empty', async({ setupUser, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { vault } = await setupVault()
      const options = { user, name: '', value: 'value', vault }
      const shouldThrow = createVariable.call(moduleVault, options as CreateVariableOptions)
      await expect(shouldThrow).rejects.toThrow(AssertionError)
    })

    it('should throw if value is missing', async({ setupUser, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { vault } = await setupVault()
      const options = { user, name: 'variable', vault }
      // @ts-expect-error: testing invalid options
      const shouldThrow = createVariable.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(AssertionError)
    })

    it('should throw if value is empty', async({ setupUser, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { vault } = await setupVault()
      const options = { user, name: 'variable', value: '', vault }
      const shouldThrow = createVariable.call(moduleVault, options as CreateVariableOptions)
      await expect(shouldThrow).rejects.toThrow(AssertionError)
    })

    it('should throw if vault is missing', async({ setupUser, moduleVault }) => {
      const { user } = await setupUser()
      const options = { user, name: 'variable', value: 'value' }
      // @ts-expect-error: testing invalid options
      const shouldThrow = createVariable.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(AssertionError)
    })
  })
})
