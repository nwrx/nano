import * as Nwrx from '@nwrx/api'
import { Application } from '@unserved/server'
import Consola from 'consola'

// --- Expose the application for type inference.
export const application = await Application.initialize([
  Nwrx.ModuleUser,
  Nwrx.ModuleFlow,
  Nwrx.ModuleWorkspace,
], {
  prefix: 'NWRX',
  logger: Consola,
  projectSecretKey: 'SECRET',
  userSecretKey: 'SECRET',
  dataSource: {
    type: 'sqlite',
    database: '.data/db.sqlite',
    synchronize: true,
  },
})

// --- Pass the application handler to the Nitro server.
export default application.createApp().handler
