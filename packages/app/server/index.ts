import { ModuleContact } from '@unserved/module-contact'
import { ModuleContent } from '@unserved/module-content'
import { ModuleHealth } from '@unserved/module-health'
import { ModuleIcon } from '@unserved/module-icon'
import { ModuleLocale } from '@unserved/module-locale'
import { ModuleLocation } from '@unserved/module-location'
import { ModuleStorageLocal } from '@unserved/module-storage-local'
import { ModuleUser } from '@unserved/module-user'
import { Application } from '@unserved/server'
import Consola from 'consola'
import { ModuleFlow } from './flow'

// --- Expose the application for type inference.
export const application = await Application.initialize([
  ModuleStorageLocal,
  ModuleContact,
  ModuleHealth,
  ModuleIcon,
  ModuleLocation,
  ModuleLocale,
  ModuleUser,
  ModuleContent,
  ModuleFlow,
], {
  logger: Consola,
  dataSource: {
    type: 'sqlite',
    database: '.data/db.sqlite',
    synchronize: true,
  },
})

// --- Pass the application handler to the Nitro server.
export default application.createApp().handler
