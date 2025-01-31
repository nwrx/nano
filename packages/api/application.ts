import { Application, createHttpRoute, ModuleBase } from '@unserved/server'
import Consola from 'consola'
import { ModuleChat } from './chat'
import { ModuleFlow } from './flow'
import { ModuleMonitoring } from './monitoring'
import { ModuleStorage, StoragePoolFS } from './storage'
import { ModuleUser } from './user'
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
    ModuleStorage,
    ModuleMonitoring,
    ModuleChat,
    ModuleHealth,
  ],
  {
    prefix: 'NANO',
    logger: Consola,
    projectSecretKey: 'SECRET',
    userSecretKey: 'SECRET',
    storagePools: [
      new StoragePoolFS('Default', { path: '.data/storage' }),
    ],
  },
)
