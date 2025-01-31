/* eslint-disable unicorn/prefer-top-level-await */
import { Application, createHttpRoute, ModuleBase } from '@unserved/server'
import Consola from 'consola'
import { ModuleChat } from './chat'
import { ModuleFlow } from './flow'
import { ModuleMonitoring } from './monitoring'
import { ModuleStorage, StoragePoolFS } from './storage'
import { ModuleUser } from './user'
import 'reflect-metadata'
import { ModuleWorkspace } from './workspace'

class ModuleHealth extends ModuleBase {
  routes = {
    getHealth: createHttpRoute({
      name: 'GET /api/health',
    }, (() => ({ ok: true }))),
  }
}

// --- Expose the application for type inference.
export const application = new Application([
  ModuleUser,
  ModuleFlow,
  ModuleWorkspace,
  ModuleStorage,
  ModuleMonitoring,
  ModuleChat,
  ModuleHealth,
], {
  prefix: 'NWRX',
  logger: Consola,
  projectSecretKey: 'SECRET',
  userSecretKey: 'SECRET',
  storagePools: [
    new StoragePoolFS('Default', { path: '.data/storage' }),
  ],
  dataSource: {
    type: 'sqlite',
    database: '.data/db.sqlite',
    synchronize: true,
  },
})

process.stdout.write('\u001Bc')
application.initialize()
  .then(() => application.createServer().listen(3001, '0.0.0.0', () => {
    Consola.success('Server listening on http://localhost:3001')
  }))
  .catch((error) => {
    Consola.error(error)
  })
