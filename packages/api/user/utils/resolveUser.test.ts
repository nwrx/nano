import type { Context } from '../../__fixtures__'
import { createContext } from '../../__fixtures__'
// import { resolveUser } from './resolveUser'

describe.concurrent<Context>('resolveUser', (it) => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })
})
