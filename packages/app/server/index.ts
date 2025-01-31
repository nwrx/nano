/* eslint-disable perfectionist/sort-imports */
import * as Nwrx from '@nwrx/api'
import { Application } from '@unserved/server'
import Consola from 'consola'

// --- Import the core and module-core packages in development mode.
// --- This allows HMR to work when making changes to those packages.
import '../../core/index'
import '../../module-core/index'
import '../../module-google/index'
import '../../module-piste-gouv-fr/index'

// --- Expose the application for type inference.
export const application = await Application.initialize([
  Nwrx.ModuleUser,
  Nwrx.ModuleFlow,
  Nwrx.ModuleWorkspace,
  Nwrx.ModuleStorage,
  Nwrx.ModuleMonitoring,
], {
  prefix: 'NWRX',
  logger: Consola,
  projectSecretKey: 'SECRET',
  userSecretKey: 'SECRET',
  storagePools: [
    new Nwrx.StoragePoolFS('Default', { path: '.data/storage' }),
  ],
  dataSource: {
    type: 'sqlite',
    database: '.data/db.sqlite',
    synchronize: true,
  },
})

// --- Pass the application handler to the Nitro server.
export default application.createApp().handler
