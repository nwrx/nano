import { implementTextDecoder } from './implementTextDecoder'
import { wrapInSandbox } from './wrapInSandbox'

describe('implementTextDecoder', () => {
  it('should register the TextDecoder class in the isolate', async() => {
    const wrapped = await wrapInSandbox(() => {
      const decoder = new TextDecoder()
      return decoder.decode(new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100]))
    })
    await implementTextDecoder(wrapped.isolate, wrapped.context)
    const result = await wrapped()
    expect(result).toStrictEqual('Hello, World')
  })
})
