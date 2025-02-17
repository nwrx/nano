/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { StartedTestContainer } from 'testcontainers'
import type { VaultVariable } from '../entities'
import type { VaultHashicorpData, VaultHashicorpOptions } from './createVaultHashicorp'
import { GenericContainer, Wait } from 'testcontainers'
import { createVaultHashicorp } from './createVaultHashicorp'

function createVaultVariable(name: string) {
  return { name } as VaultVariable<VaultHashicorpData>
}

describe.sequential('createKeyVaultHashicorp', () => {
  let container: GenericContainer
  let testContainer: StartedTestContainer

  const options: VaultHashicorpOptions = {
    endpoint: 'http://localhost:18200',
    token: 'SECRET_TOKEN',
    path: 'secret',
  }

  beforeAll(async() => {
    container = new GenericContainer('hashicorp/vault:1.18.4')
      .withReuse()
      .withExposedPorts({ container: 8200, host: 18200 })
      .withEnvironment({ VAULT_DEV_ROOT_TOKEN_ID: options.token })
      .withWaitStrategy(Wait.forListeningPorts())
    testContainer = await container.start()
  })

  afterAll(async() => {
    await testContainer.stop()
  })

  describe('initialize', (it) => {
    it('should initialize vault client', async() => {
      const vault = createVaultHashicorp(options)
      const shouldNotReject = vault.initialize()
      await expect(shouldNotReject).resolves.not.toThrow()
    })

    it('should throw on invalid token', async() => {
      const vault = createVaultHashicorp({ ...options, token: 'INVALID_TOKEN' })
      const shouldReject = vault.initialize()
      await expect(shouldReject).rejects.toThrow('Failed to initialize access to HashiCorp Vault: 2 errors occurred:')
    })

    it('should throw on invalid endpoint', async() => {
      const vault = createVaultHashicorp({ ...options, endpoint: 'http://localhost:18201' })
      const shouldReject = vault.initialize()
      await expect(shouldReject).rejects.toThrow('ailed to connect to HashiCorp Vault: fetch failed')
    })
  })

  describe('setValue', (it) => {
    it('should set a value', async() => {
      const vault = createVaultHashicorp(options)
      await vault.initialize()
      const variable = createVaultVariable('MY_KEY')
      const result = await vault.setValue(variable, 'FANCY_VALUE')
      expect(result).toMatchObject({ version: expect.any(Number) })
    })

    it('should overwrite a value', async() => {
      const vault = createVaultHashicorp(options)
      await vault.initialize()
      const variable = createVaultVariable('MY_KEY')
      await vault.setValue(variable, 'FANCY_VALUE')
      const result = await vault.setValue(variable, 'FANCY_VALUE_2')
      expect(result).toMatchObject({ version: expect.any(Number) })
    })

    it('should throw on invalid key', async() => {
      const vault = createVaultHashicorp(options)
      await vault.initialize()
      const variable = createVaultVariable('')
      const shouldReject = vault.setValue(variable, 'FANCY_VALUE')
      await expect(shouldReject).rejects.toThrow('Failed to set value in HashiCorp Vault: cannot write to a path ending in \'/\'')
    })
  })

  describe('getValue', (it) => {
    it('should get a value', async() => {
      const vault = createVaultHashicorp(options)
      await vault.initialize()
      const variable = createVaultVariable('MY_KEY')
      await vault.setValue(variable, 'FANCY_VALUE')
      const result = await vault.getValue(variable)
      expect(result).toEqual('FANCY_VALUE')
    })

    it('should throw on non-existent key', async() => {
      const vault = createVaultHashicorp(options)
      await vault.initialize()
      const variable = createVaultVariable('NON_EXISTENT_KEY')
      const shouldReject = vault.getValue(variable)
      await expect(shouldReject).rejects.toThrow('Failed to get value from HashiCorp Vault: Secret at key "NON_EXISTENT_KEY" not found')
    })

    it('should throw on invalid key', async() => {
      const vault = createVaultHashicorp(options)
      await vault.initialize()
      const variable = createVaultVariable('')
      const shouldReject = vault.getValue(variable)
      await expect(shouldReject).rejects.toThrow('Failed to get value from HashiCorp Vault: Secret at key "" not found')
    })
  })

  describe('deleteValue', (it) => {
    it('should delete a value', async() => {
      const vault = createVaultHashicorp(options)
      await vault.initialize()
      const variable = createVaultVariable('NON_EXISTENT_KEY')
      await vault.setValue(variable, 'FANCY_VALUE')
      const result = await vault.deleteValue(variable)
      expect(result).toBeUndefined()
    })

    it('should resolve even if key does not exist', async() => {
      const vault = createVaultHashicorp(options)
      await vault.initialize()
      const variable = createVaultVariable('NON_EXISTENT_KEY')
      const result = await vault.deleteValue(variable)
      expect(result).toBeUndefined()
    })
  })

  describe('listValues', (it) => {
    it('should list all values', async() => {
      const vault = createVaultHashicorp(options)
      await vault.initialize()
      const variable = createVaultVariable('MY_KEY')
      await vault.setValue(variable, 'FANCY_VALUE')
      const result = await vault.listValues()
      expect(result).toStrictEqual(['MY_KEY'])
    })
  })
})
