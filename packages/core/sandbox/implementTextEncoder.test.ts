import { implementTextEncoder } from './implementTextEncoder'
import { wrapInSandbox } from './wrapInSandbox'

describe('implementTextEncoder', () => {
  it('should register the TextEncoder class in the isolate', async() => {
    const wrapped = await wrapInSandbox(() => {
      const encoder = new TextEncoder()
      return encoder.encode('Hello, World')
    })
    await implementTextEncoder(wrapped.isolate, wrapped.context)
    const result = await wrapped()
    expect(result).toStrictEqual(new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100]))
  })
})
