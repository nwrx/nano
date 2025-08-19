import { Application, createHttpRoute, ModuleBase } from '@unserved/server'
import Consola from 'consola'
import { DataSource } from 'typeorm'
import { ModuleChat } from './chat'
import { ENV_CONFIG_SCHEMA, ENV_DATABASE_SCHEMA } from './environment'
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

function getDataSource() {
  if (process.env.NODE_ENV === 'production') {
    const database = ENV_DATABASE_SCHEMA(process.env)
    return new DataSource({
      type: 'postgres',
      host: database.DATABASE_HOST,
      port: database.DATABASE_PORT,
      username: database.DATABASE_USERNAME,
      password: database.DATABASE_PASSWORD,
      database: database.DATABASE_NAME,
      synchronize: database.DATABASE_SYNCRONIZE,
    })
  }
  else {
    return new DataSource({
      type: 'sqlite',
      database: '.data/database.sqlite',
      synchronize: true,
    })
  }
}

class ModuleHealth extends ModuleBase {
  routes = {
    getHealth: createHttpRoute({ name: 'GET /health' }, (() => ({
      ok: true,
      modules: this.getApplication().modules.map(module => module.constructor.name),
    }))),
    getReady: createHttpRoute({ name: 'GET /ready' }, (() => ({
      ok: true,
      status: 'ready',
    }))),
  }
}

// --- Expose the application for type inference.
const config = ENV_CONFIG_SCHEMA(process.env)
export const application = new Application(
  [
    new ModuleUser({
      userSecretKey: config.USER_SECRET_KEY,
      userTrustProxy: config.USER_TRUST_PROXY,
      userCypherAlgorithm: config.USER_CYPHER_ALGORITHM,
      userSessionDuration: config.USER_SESSION_DURATION,
      userRecoveryDuration: config.USER_RECOVERY_DURATION,
      userSessionIdCookieName: config.USER_SESSION_ID_COOKIE_NAME,
      userSessionTokenCookieName: config.USER_SESSION_TOKEN_COOKIE_NAME,
    }),
    new ModuleRunner({
      initialRunners: config.INITIAL_RUNNERS,
    }),
    new ModuleVault({
      vaultDefaultLocalSecretKey: config.VAULT_DEFAULT_LOCAL_SECRET_KEY,
      vaultConfigurationAlgorithm: config.VAULT_CONFIGURATION_ALGORITHM,
      vaultConfigurationSecretKey: config.VAULT_CONFIGURATION_SECRET_KEY,
    }),
    new ModuleIconCollection({
      iconCdnUrl: 'https://esm.sh/',
      iconIconifyUrl: 'https://api.iconify.design',
    }),
    new ModuleStorage({
      storagePools: new Map([
        ['Default', createStoragePoolFs({ path: config.STORAGE_PATH })],
      ]),
    }),
    ModuleFlow,
    ModuleFlowEditor,
    ModuleWorkspace,
    ModuleProject,
    ModuleChat,
    ModuleHealth,
    ModuleThread,
    ModuleIcon,
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
    dataSource: getDataSource(),
  },
)
