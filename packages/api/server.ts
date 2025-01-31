/* eslint-disable unicorn/prefer-top-level-await */
import Consola from 'consola'
import { application } from './application'

process.stdout.write('\u001Bc')
application.initialize()
  .then(() => application.createServer().listen(3001, '0.0.0.0', () => {
    Consola.success('Server listening on http://localhost:3001')
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
