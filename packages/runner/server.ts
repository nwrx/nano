/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Application } from '@unserved/server'
import { ModuleRunner } from './module'

const HOST = process.env.HOST || '0.0.0.0'
const PORT = Number.parseInt(process.env.PORT || '3300')

const application = new Application([ModuleRunner])

application.createServer().listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`)
})
