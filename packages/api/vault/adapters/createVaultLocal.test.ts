/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Encrypted } from '../../utils'
import type { VaultVariable } from '../entities'
import type { VaultLocalOptions } from './createVaultLocal'
import { ModuleVault } from '../index'
import { createVaultLocal } from './createVaultLocal'

function createVaultVariable(name: string, data?: Encrypted) {
  return { name, data } as unknown as VaultVariable<Encrypted>
}

describe('createVaultLocal', () => {
  const options: VaultLocalOptions = {
    algorithm: 'aes-256-gcm',
    secret: 'super-secret-key',
  }

  describe('initialize', (it) => {
    it('should initialize vault client', async() => {
      const module = new ModuleVault()
      const vault = createVaultLocal.call(module, options)
      const shouldNotReject = vault.initialize()
      await expect(shouldNotReject).resolves.not.toThrow()
    })

    it('should throw on invalid algorithm', async() => {
      const module = new ModuleVault()
      // @ts-expect-error: invalid algorithm
      const vault = createVaultLocal.call( module, { ...options, algorithm: 'aes-256-cbc' })
      const shouldReject = vault.initialize()
      const error = module.errors.VAULT_ADAPTER_LOCAL_ENCRYPTION_ALGORITHM_NOT_SUPPORTED('aes-256-cbc')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw on missing secret', async() => {
      const module = new ModuleVault()
      const vault = createVaultLocal.call(module, { ...options, secret: '' })
      const shouldReject = vault.initialize()
      const error = module.errors.VAULT_ADAPTER_LOCAL_ENCRYPTION_KEY_REQUIRED()
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe('setValue', (it) => {
    it('should encrypt a value', async() => {
      const module = new ModuleVault()
      const vault = createVaultLocal.call(module, options)
      const variable = createVaultVariable('MY_KEY')
      const result = await vault.setValue(variable, 'FANCY_VALUE')
      expect(result).toMatchObject({
        iv: expect.any(String),
        tag: expect.any(String),
        cipher: expect.any(String),
        salt: expect.any(String),
        algorithm: options.algorithm,
      })
    })

    it('should encrypt same value differently due to random IV', async() => {
      const module = new ModuleVault()
      const vault = createVaultLocal.call(module, options)
      const variable1 = createVaultVariable('MY_KEY')
      const variable2 = createVaultVariable('MY_KEY')
      const result1 = await vault.setValue(variable1, 'SAME_VALUE')
      const result2 = await vault.setValue(variable2, 'SAME_VALUE')
      expect(result1).not.toMatchObject(result2)
    })
  })

  describe('getValue', (it) => {
    it('should decrypt an encrypted value', async() => {
      const module = new ModuleVault()
      const vault = createVaultLocal.call(module, options)
      const variable = createVaultVariable('MY_KEY')
      const originalValue = 'FANCY_VALUE'
      await vault.setValue(variable, originalValue)
      const result = await vault.getValue(variable)
      expect(result).toEqual(originalValue)
    })

    it('should decrypt value encrypted with same key from another vault instance', async() => {
      const module = new ModuleVault()
      const vault1 = createVaultLocal.call(module, options)
      const vault2 = createVaultLocal.call(module, options)
      const variable = createVaultVariable('MY_KEY')
      await vault1.setValue(variable, 'FANCY_VALUE')
      const result = await vault2.getValue(variable)
      expect(result).toEqual('FANCY_VALUE')
    })
  })

  describe('deleteValue', (it) => {
    it('should clear the data of a variable', async() => {
      const module = new ModuleVault()
      const vault = createVaultLocal.call(module, options)
      const variable = createVaultVariable('MY_KEY')
      await vault.setValue(variable, 'FANCY_VALUE')
      await vault.deleteValue(variable)
      expect(variable.data).toEqual({
        iv: '',
        tag: '',
        cipher: '',
        salt: '',
        algorithm: options.algorithm,
      })
    })
  })

  describe('listValues', (it) => {
    it('should return empty array', async() => {
      const module = new ModuleVault()
      const vault = createVaultLocal.call(module, options)
      const result = await vault.listValues()
      expect(result).toEqual([])
    })
  })
})
