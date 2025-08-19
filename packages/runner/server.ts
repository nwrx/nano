/* eslint-disable unicorn/prefer-top-level-await */
import Consola from 'consola'
import 'source-map-support/register.js'
import { application } from './application'
import { ENV_APP_SCHEMA } from './environment'

const { PORT, HOST } = ENV_APP_SCHEMA(process.env)

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
