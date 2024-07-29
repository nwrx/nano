import { Application } from '@unserved/server'
import { ModuleChain } from './chain'

// --- Expose the application for type inference.
export const application = await Application.initialize([
  Server.ModuleStorageLocal,
  Server.ModuleContact,
  Server.ModuleHealth,
  Server.ModuleIcon,
  Server.ModuleLocation,
  Server.ModuleUser,
  Server.ModuleContent,
  ModuleChain,
])

// --- Pass the application handler to the Nitro server.
export default application.createApp().handler
