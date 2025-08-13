/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable unicorn/prefer-top-level-await */
import Consola from 'consola'
import { getRequestHeader, setResponseHeader, setResponseStatus } from 'h3'
import 'source-map-support/register.js'
import { application } from './application'

const PORT = Number.parseInt(process.env.PORT || '3001', 10)
const HOST = process.env.HOST ?? '0.0.0.0'

const ALLOWED_ORIGINS = [
  'https://app.nwrx.io',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
]

application.initialize()
  .then(() => {
    application.createServer({
      onRequest: (event) => {
        const originFromHeader = getRequestHeader(event, 'origin') || ''
        const originAllowed = ALLOWED_ORIGINS.find(o => originFromHeader.startsWith(o)) || ALLOWED_ORIGINS[0]
        setResponseHeader(event, 'Access-Control-Allow-Origin', originAllowed)
        setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD')
        setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
        setResponseHeader(event, 'Access-Control-Allow-Credentials', 'true')

        // Handle preflight OPTIONS requests
        if (event.node.req.method === 'OPTIONS') {
          setResponseHeader(event, 'Access-Control-Max-Age', 86400)
          setResponseStatus(event, 204)
          event.node.res.end()
        }
      },
    }).listen(PORT, HOST, () => {
      Consola.success('Server listening on %s:%d', HOST, PORT)
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
