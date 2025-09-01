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
      trustProxy: config.NANO_TRUST_PROXY,
      sessionDuration: config.NANO_SESSION_DURATION,
      sessionIdCookieName: config.NANO_SESSION_ID_COOKIE_NAME,
      sessionTokenCookieName: config.NANO_SESSION_TOKEN_COOKIE_NAME,
      sessionEncryptionSecret: config.NANO_SESSION_ENCRYPTION_SECRET,
      sessionEncryptionAlgorithm: config.NANO_SESSION_ENCRYPTION_ALGORITHM,
      recoveryTokenDuration: config.NANO_USER_RECOVERY_TOKEN_DURATION,
    }),
    new ModuleRunner({
      initialRunners: config.NANO_RUNNER_INITIAL_SERVERS,
    }),
    new ModuleVault({
      encryptionSecret: config.NANO_VAULT_ENCRYPTION_SECRET,
      encryptionAlgorithm: config.NANO_VAULT_ENCRYPTION_ALGORITHM,
    }),
    new ModuleIconCollection({
      iconCdnUrl: config.NANO_ICON_CDN_URL,
      iconifyUrl: config.NANO_ICONIFY_URL,
    }),
    new ModuleStorage({
      publicPoolType: config.NANO_STORAGE_PUBLIC_POOL_TYPE,
      publicPoolConfiguration: config.NANO_STORAGE_PUBLIC_POOL_CONFIGURATION,
      encryptionKey: config.NANO_STORAGE_ENCRYPTION_SECRET,
      encryptionAlgorithm: config.NANO_STORAGE_ENCRYPTION_ALGORITHM,
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
