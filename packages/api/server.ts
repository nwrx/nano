/* eslint-disable unicorn/no-process-exit */
/* eslint-disable n/no-process-exit */
/* eslint-disable unicorn/prefer-top-level-await */
import Consola from 'consola'
import { setResponseHeader, setResponseStatus } from 'h3'
import { application } from './application'
import { getConfigFromEnvironment } from './utils'
// import { environment } from './utils'

// --- Side-effects
import 'source-map-support/register.js'
import 'dotenv/config'

// --- Initialize the application and start the server.
let server: ReturnType<typeof application.createServer> | undefined
const { PORT, HOST, APP_URL } = getConfigFromEnvironment()

application.initialize()
  .then(() => {
    server = application.createServer({
      onRequest: (event) => {
        if (!APP_URL) return
        setResponseHeader(event, 'Access-Control-Allow-Origin', APP_URL)
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
    }).listen(PORT, HOST, () => {
      Consola.success('Server listening on %s:%d', HOST, PORT)
    })
  })
  .catch((error) => {
    console.error(error)
  })

// handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error(error)
})

// handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(error)
})

// --- Graceful shutdown handling
function gracefulShutdown(signal: string) {
  Consola.info(`Received ${signal}, starting graceful shutdown...`)

  if (server) {
    server.close(() => {
      Consola.info('HTTP server closed')
      Consola.info('Graceful shutdown complete')
      process.exit(0)
    })

    // --- Force shutdown after 10 seconds if graceful shutdown takes too long
    setTimeout(() => {
      Consola.warn('Force shutdown after timeout')
      process.exit(1)
    }, 10_000)
  }
  else {
    Consola.info('No server to close, exiting immediately')
    process.exit(0)
  }
}

// Listen for shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGHUP', () => gracefulShutdown('SIGHUP'))
