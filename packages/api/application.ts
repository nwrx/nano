import { Application, createHttpRoute, ModuleBase } from '@unserved/server'
import Consola from 'consola'
import { ModuleChat } from './chat'
import { ModuleFlow } from './flow'
import { ModuleFlowEditor } from './flowEditor'
import { ModuleIcon } from './icon'
import { ModuleIconCollection } from './iconCollection'
import { ModuleMcpGateway } from './mcpGateway'
import { ModuleMcpManager } from './mcpManager'
import { ModuleMcpPool } from './mcpPool'
import { ModuleMcpServer } from './mcpServer'
import { ModuleMcpServerArgument } from './mcpServerArgument'
import { ModuleMcpServerVariable } from './mcpServerVariable'
import { ModuleProject } from './project'
import { ModuleRegistry } from './registry'
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
    ModuleFlowEditor,
    ModuleWorkspace,
    ModuleVault,
    ModuleProject,
    ModuleStorage,
    ModuleChat,
    ModuleHealth,
    ModuleThread,
    ModuleIcon,
    ModuleIconCollection,
    ModuleThreadRunner,
    ModuleRegistry,
    ModuleMcpManager,
    ModuleMcpGateway,
    ModuleMcpPool,
    ModuleMcpServer,
    ModuleMcpServerArgument,
    ModuleMcpServerVariable,
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
