/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable unicorn/prefer-top-level-await */
import type { ModuleBase } from '@unserved/server'
import Consola from 'consola'
import { application } from './application'
import 'source-map-support/register'

const PORT = Number.parseInt(process.env.PORT || '3001', 10)
const HOST = process.env.HOST ?? '0.0.0.0'

const isDebug = process.env.DEBUG === 'true'
const isProduction = process.env.NODE_ENV === 'production'

application.initialize()
  .then(() => application.createServer().listen(PORT, HOST, () => {
    Consola.success('Server listening on %s:%d', HOST, PORT)

    // Log all routes for debugging.
    if (isDebug && !isProduction) {
      for (const module of application.modules as ModuleBase[]) {
        if (!module.routes) continue
        const moduleName = module.constructor.name
        for (let route of Object.values(module.routes)) {
        // eslint-disable-next-line sonarjs/updated-loop-counter
          route = typeof route === 'function' ? route.call(module) : route
          const [method, path] = route.name.split(' ')
          const methodStaticLength = method.padEnd(7)
          Consola.withTag(moduleName).success('- %s %s', methodStaticLength, path)
        }
      }
    }
  }))
  .catch((error) => {
    Consola.error(error)
  })

// handle unhandled rejections
process.on('unhandledRejection', (error) => {
  Consola.error(error)
})

// handle uncaught exceptions
process.on('uncaughtException', (error) => {
  Consola.error(error)
})
