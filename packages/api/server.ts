/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable unicorn/prefer-top-level-await */
import Consola from 'consola'
import { application } from './application'

const PORT = Number.parseInt(process.env.PORT || '3001', 10)
const HOST = process.env.HOST ?? '0.0.0.0'

application.initialize()
  .then(() => application.createServer().listen(PORT, HOST, () => {
    Consola.success('Server listening on %s:%d', HOST, PORT)
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
