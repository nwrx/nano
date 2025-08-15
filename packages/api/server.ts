/* eslint-disable unicorn/prefer-top-level-await */
import Consola from 'consola'
import { setResponseHeader, setResponseStatus } from 'h3'
import 'source-map-support/register.js'
import { application } from './application'
import { environment } from './environment'

application.initialize()
  .then(() => {
    application.createServer({
      onRequest: (event) => {
        if (!environment.APP_URL) return
        setResponseHeader(event, 'Access-Control-Allow-Origin', environment.APP_URL)
        setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD')
        setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
        setResponseHeader(event, 'Access-Control-Allow-Credentials', 'true')

        // Handle preflight OPTIONS requests
        if (event.method === 'OPTIONS') {
          setResponseHeader(event, 'Access-Control-Max-Age', 86400)
          setResponseStatus(event, 204)
          event.node.res.end()
        }
      },
      onError: (error, event) => {
        Consola.error(error.message)
        setResponseStatus(event, error.statusCode || 500)
        setResponseHeader(event, 'Content-Type', 'application/json')
        event.node.res.end(JSON.stringify({
          name: error.name,
          message: error.message,
          data: error.data,
          stack: error.stack,
        }))
      },
    }).listen(environment.PORT, environment.HOST, () => {
      Consola.success('Server listening on %s:%d', environment.HOST, environment.PORT)
    })
  })
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
