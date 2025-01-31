import { Application } from '@unserved/server'
import { ModuleRunner } from './index'

const application = new Application([ModuleRunner])
application.createServer().listen(3300, () => {
  console.log('Server is running on http://localhost:3300')
})
