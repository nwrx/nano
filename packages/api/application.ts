import { Application, createHttpRoute, ModuleBase } from '@unserved/server'
import Consola from 'consola'
import { DataSource } from 'typeorm'
import { ModuleChat } from './chat'
import { environment } from './environment'
import { ModuleFlow } from './flow'
import { ModuleFlowEditor } from './flowEditor'
import { ModuleIcon } from './icon'
import { ModuleIconCollection } from './iconCollection'
import { ModuleMcpGateway } from './mcpGateway'
import { ModuleMcpManager } from './mcpManager'
import { ModuleMcpPool } from './mcpPool'
import { ModuleMcpServer } from './mcpServer'
import { ModuleMcpServerArgument } from './mcpServerArgument'
import { ModuleMcpServerEvent } from './mcpServerEvent'
import { ModuleMcpServerVariable } from './mcpServerVariable'
import { ModuleProject } from './project'
import { ModuleRegistry } from './registry'
import { ModuleRunner } from './runner'
import { ModuleStorage } from './storage'
import { createStoragePoolFs } from './storage/utils'
import { ModuleThread } from './thread'
import { ModuleUser } from './user'
import { ModuleVault } from './vault'
import { ModuleWorkspace } from './workspace'

class ModuleHealth extends ModuleBase {
  routes = {
    getHealth: createHttpRoute({ name: 'GET /health' }, (() => ({
      ok: true,
      modules: this.getApplication().modules.map(module => module.constructor.name),
    }))),
  }
}

// --- Expose the application for type inference.
export const application = new Application(
  [
    new ModuleUser({
      userSecretKey: environment.USER_SECRET_KEY,
      userTrustProxy: environment.USER_TRUST_PROXY,
      userCypherAlgorithm: environment.USER_CYPHER_ALGORITHM,
      userSessionDuration: environment.USER_SESSION_DURATION,
      userRecoveryDuration: environment.USER_RECOVERY_DURATION,
      userSessionIdCookieName: environment.USER_SESSION_ID_COOKIE_NAME,
      userSessionTokenCookieName: environment.USER_SESSION_TOKEN_COOKIE_NAME,
    }),
    new ModuleVault({
      vaultDefaultLocalSecretKey: environment.VAULT_DEFAULT_LOCAL_SECRET_KEY,
      vaultConfigurationAlgorithm: environment.VAULT_CONFIGURATION_ALGORITHM,
      vaultConfigurationSecretKey: environment.VAULT_CONFIGURATION_SECRET_KEY,
    }),
    new ModuleIconCollection({
      iconCdnUrl: 'https://esm.sh/',
      iconIconifyUrl: 'https://api.iconify.design',
    }),
    ModuleFlow,
    ModuleFlowEditor,
    ModuleWorkspace,
    ModuleProject,
    ModuleStorage,
    ModuleChat,
    ModuleHealth,
    ModuleThread,
    ModuleIcon,
    ModuleRunner,
    ModuleRegistry,
    ModuleMcpManager,
    ModuleMcpGateway,
    ModuleMcpPool,
    ModuleMcpServer,
    ModuleMcpServerEvent,
    ModuleMcpServerArgument,
    ModuleMcpServerVariable,
  ],
  {
    logger: Consola,

    // Storage
    storagePools: new Map([
      ['Default', createStoragePoolFs({ path: '.data/storage' })],
    ]),

    // Database
    dataSource: process.env.NODE_ENV === 'production'
      ? new DataSource({
        type: 'postgres',
        url: environment.DATABASE_URL,
        synchronize: environment.DATABASE_SYNCRONIZE,
      })
      : new DataSource({
        type: 'sqlite',
        database: '.data/database.sqlite',
        synchronize: true,
      }),
  },
)
