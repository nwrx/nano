import { Application } from '@unserved/server'
import { ModuleRunner } from './index'

const application = new Application([ModuleRunner])
application.createServer().listen(3300)
