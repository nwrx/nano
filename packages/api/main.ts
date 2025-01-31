/* eslint-disable perfectionist/sort-imports */
import { Application } from '@unserved/server'
// import { ModuleUser } from './user'
import { ModuleThread } from './thread'
import Consola from 'consola'

// --- Import the core and module-core packages in development mode.
// --- This allows HMR to work when making changes to those packages.
// import { ModuleFlow } from './flow'
// import { ModuleProject } from './project'
// import { ModuleStorage, StoragePoolFS } from './storage'
// import { ModuleChat } from './chat'

// --- Expose the application for type inference.
export const application = await Application.initialize([
  // ModuleUser,
  ModuleThread,
  // ModuleFlow,
  // ModuleProject,
  // ModuleStorage,
  // ModuleChat,
], {
  prefix: 'NWRX',
  logger: Consola,
  // projectSecretKey: 'SECRET',
  // userSecretKey: 'SECRET',
  // storagePools: [
  //   new StoragePoolFS('Default', { path: '.data/storage' }),
  // ],
  dataSource: {
    type: 'sqlite',
    database: '.data/db.sqlite',
    synchronize: true,
  },
})

// --- Pass the application handler to the Nitro server.
export default application.createServer().listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
