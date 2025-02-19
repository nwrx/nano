import { Application, createHttpRoute, ModuleBase } from '@unserved/server'
import Consola from 'consola'
import { ModuleChat } from './chat'
import { ModuleFlow } from './flow'
import { ModuleProject } from './project'
import { ModuleStorage } from './storage'
import { createStoragePoolFs } from './storage/utils'
import { ModuleThread } from './thread'
import { ModuleThreadRunner } from './threadRunner'
import { ModuleUser } from './user'
import { ModuleVault } from './vault'
import { ModuleWorkspace } from './workspace'

class ModuleHealth extends ModuleBase {
  routes = {
    getHealth: createHttpRoute({ name: 'GET /api/health' }, (() => ({
      ok: true,
      modules: this.getApplication().modules.map(module => module.constructor.name),
    }))),
  }
}

// --- Expose the application for type inference.
export const application = new Application(
  [
    ModuleUser,
    ModuleFlow,
    ModuleWorkspace,
    ModuleVault,
    ModuleProject,
    ModuleStorage,
    ModuleChat,
    ModuleHealth,
    ModuleThread,
    ModuleThreadRunner,
  ],
  {
    prefix: 'NANO',
    logger: Consola,

    // User
    userSecretKey: 'SECRET',

    // Vault
    vaultConfigurationAlgorithm: 'aes-256-gcm',
    vaultConfigurationSecretKey: 'SECRET',
    vaultDefaultLocalSecretKey: 'SECRET',

    // Storage
    storagePools: new Map([
      ['Default', createStoragePoolFs({ path: '.data/storage' })],
    ]),

    // Database
    dataSource: {
      type: 'sqlite',
      database: '.data/database.sqlite',
      synchronize: true,
    },
  },
)
