/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import type { VaultLocalOptions } from '../adapters'
import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { createTestContext } from '../../__fixtures__'
import { VaultVariable } from '../entities'
import { createVariable, type CreateVariableOptions } from './createVariable'
import { getVariableValue } from './getVariableValue'

describe.concurrent<Context>('createVariable', { timeout: 300 }, () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  const configuration: VaultLocalOptions = {
    algorithm: 'aes-256-gcm',
    secret: 'secret-key',
  }

  describe<Context>('createVariable', (it) => {
    it('should create a variable', async({ createUser, createVault, moduleVault }) => {
      const { user, workspace } = await createUser()
      const { vault } = await createVault('vault', user, workspace)
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

    it('should save the variable to the database', async({ createUser, createVault, moduleVault }) => {
      const { user, workspace } = await createUser()
      const { vault } = await createVault('vault', user, workspace)
      const options = { user, name: 'variable', value: 'value', vault }
      const variable = await createVariable.call(moduleVault, options as CreateVariableOptions)
      const { VaultVariable } = moduleVault.getRepositories()
      const found = await VaultVariable.findOneBy({ id: variable.id })
      expect(found).toMatchObject({ id: variable.id })
    })

    it('should store the encrypted value in the vault', async({ createUser, createVault, moduleVault }) => {
      const { user, workspace } = await createUser()
      const { vault } = await createVault('vault', user, workspace)
      const options = { user, name: 'variable', value: 'secret-value', vault }
      await createVariable.call(moduleVault, options as CreateVariableOptions)
      const value = await getVariableValue.call(moduleVault, { vault, name: 'variable' })
      expect(value).toBe('secret-value')
    })
  })

  describe('validation', () => {
    describe<Context>('user', (it) => {
      it('should throw if user is missing', async({ createUser, createVault, moduleVault }) => {
        const { user, workspace } = await createUser()
        const { vault } = await createVault('vault', user, workspace)
        const options = { name: 'variable', value: 'value', vault }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVariable.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if user.id is not a UUID', async({ createUser, createVault, moduleVault }) => {
        const { user, workspace } = await createUser()
        const { vault } = await createVault('vault', user, workspace)
        const options = { user: { id: 'invalid' }, name: 'variable', value: 'value', vault }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVariable.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('name', (it) => {
      it('should throw if name is missing', async({ createUser, createVault, moduleVault }) => {
        const { user, workspace } = await createUser()
        const { vault } = await createVault('vault', user, workspace)
        const options = { user, value: 'value', vault }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVariable.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if name is empty', async({ createUser, createVault, moduleVault }) => {
        const { user, workspace } = await createUser()
        const { vault } = await createVault('vault', user, workspace)
        const options = { user, name: '', value: 'value', vault }
        const shouldThrow = createVariable.call(moduleVault, options as CreateVariableOptions)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('value', (it) => {
      it('should throw if value is missing', async({ createUser, createVault, moduleVault }) => {
        const { user, workspace } = await createUser()
        const { vault } = await createVault('vault', user, workspace)
        const options = { user, name: 'variable', vault }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVariable.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if value is empty', async({ createUser, createVault, moduleVault }) => {
        const { user, workspace } = await createUser()
        const { vault } = await createVault('vault', user, workspace)
        const options = { user, name: 'variable', value: '', vault }
        const shouldThrow = createVariable.call(moduleVault, options as CreateVariableOptions)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('vault', (it) => {
      it('should throw if vault is missing', async({ createUser, moduleVault }) => {
        const { user } = await createUser()
        const options = { user, name: 'variable', value: 'value' }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVariable.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if vault.id is not a UUID', async({ createUser, moduleVault }) => {
        const { user } = await createUser()
        const options = { user, name: 'variable', value: 'value', vault: { id: 'invalid', type: 'local', configuration } }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVariable.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if vault.type is invalid', async({ createUser, moduleVault }) => {
        const { user } = await createUser()
        const options = { user, name: 'variable', value: 'value', vault: { id: randomUUID(), type: 'invalid', configuration } }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVariable.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if vault.configuration is missing', async({ createUser, moduleVault }) => {
        const { user } = await createUser()
        const options = { user, name: 'variable', value: 'value', vault: { id: randomUUID(), type: 'local' } }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVariable.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if vault.configuration is not an object', async({ createUser, moduleVault }) => {
        const { user } = await createUser()
        const options = { user, name: 'variable', value: 'value', vault: { id: randomUUID(), type: 'local', configuration: 'invalid' } }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVariable.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })
  })
})
