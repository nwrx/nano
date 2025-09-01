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
import { ModuleMcpServerEvent } from './mcpServerEvent'
import { ModuleMcpServerVariable } from './mcpServerVariable'
import { ModuleProject } from './project'
import { ModuleRegistry } from './registry'
import { ModuleRunner } from './runner'
import { ModuleStorage } from './storage'
import { ModuleThread } from './thread'
import { ModuleUser } from './user'
import { getConfigFromEnvironment, getDataSource } from './utils'
import { ModuleVault } from './vault'
import { ModuleWorkspace } from './workspace'

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
const config = getConfigFromEnvironment()
export const application = new Application(
  [
    new ModuleUser({
      userSecretKey: config.USER_SECRET_KEY,
      userTrustProxy: config.USER_TRUST_PROXY,
      userCypherAlgorithm: config.USER_CYPHER_ALGORITHM,
      userSessionDuration: config.USER_SESSION_DURATION,
      // userRecoveryDuration: config.USER_RECOVERY_DURATION,
      userSessionIdCookieName: config.USER_SESSION_ID_COOKIE_NAME,
      userSessionTokenCookieName: config.USER_SESSION_TOKEN_COOKIE_NAME,
    }),
    new ModuleRunner({
      initialRunners: config.INITIAL_RUNNERS,
    }),
    new ModuleVault({
      vaultConfigurationAlgorithm: config.VAULT_CONFIGURATION_ALGORITHM,
      vaultConfigurationSecretKey: config.VAULT_CONFIGURATION_SECRET_KEY,
    }),
    new ModuleIconCollection({
      iconCdnUrl: config.ICON_CDN_URL,
      iconIconifyUrl: config.ICON_ICONIFY_URL,
    }),
    new ModuleStorage({
      publicPoolType: config.STORAGE_PUBLIC_POOL_TYPE,
      publicPoolConfiguration: config.STORAGE_PUBLIC_POOL_CONFIGURATION,
      configurationEncryptionKey: config.STORAGE_POOL_ENCRYPTION_SECRET,
      configurationEncryptionAlgorithm: config.STORAGE_POOL_ENCRYPTION_ALGORITHM,
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
