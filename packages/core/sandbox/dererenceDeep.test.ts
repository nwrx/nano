import ivm from 'isolated-vm'
import { dererenceDeep } from './dererenceDeep'

describe('dererenceDeep', () => {
  describe('primitive', () => {
    it('should return the value as-is if it is not a reference', () => {
      const result = dererenceDeep('string')
      expect(result).toStrictEqual('string')
    })

    it('should return a copy of a string reference', () => {
      const value = new ivm.Reference('string')
      const result = dererenceDeep(value)
      expect(result).toStrictEqual('string')
    })

    it('should return a copy of a number reference', () => {
      const value = new ivm.Reference(42)
      const result = dererenceDeep(value)
      expect(result).toStrictEqual(42)
    })

    it('should return a copy of a boolean reference', () => {
      const value = new ivm.Reference(true)
      const result = dererenceDeep(value)
      expect(result).toStrictEqual(true)
    })
  })

  describe('object', () => {
    it('should dereference a reference of an object', () => {
      const value = new ivm.Reference({ hello: 'world' })
      const result = dererenceDeep(value)
      expect(result.hello).toStrictEqual('world')
    })

    it('should dereference nested references of an object', () => {
      const value = { hello: new ivm.Reference('world') }
      const result = dererenceDeep(value)
      expect(result.hello).toStrictEqual('world')
    })

    it('should dereference nested object references in a reference', () => {
      const value = new ivm.Reference({ nested: new ivm.Reference({ hello: 'world' }) })
      const result = dererenceDeep(value)
      expect(result.nested.hello).toStrictEqual('world')
    })

    it('should dereference nested object references in an array reference', () => {
      const value = new ivm.Reference([{ hello: new ivm.Reference('world') }])
      const result = dererenceDeep(value)
      expect(result[0].hello).toStrictEqual('world')
    })

    it('should dereference Uint8Array references', () => {
      const value = new ivm.Reference(new Uint8Array([72, 101, 108, 108, 111]))
      const result = dererenceDeep(value)
      expect(result).toStrictEqual(new Uint8Array([72, 101, 108, 108, 111]))
    })

    it('should dereference nested Uint8Array references', () => {
      const value = new ivm.Reference({ data: new ivm.Reference(new Uint8Array([72, 101, 108, 108, 111])) })
      const result = dererenceDeep(value)
      expect(result.data).toStrictEqual(new Uint8Array([72, 101, 108, 108, 111]))
    })
  })

  describe('function', () => {
    it('should dereference the an asyncronous function', async() => {
      const value = new ivm.Reference(() => Promise.resolve('Hello, World!'))
      const deref = dererenceDeep(value)
      const result = await deref()
      expect(result).toStrictEqual('Hello, World!')
    })

    it('should dereference a syncronous function and return a promise', async() => {
      const value = new ivm.Reference(() => 'Hello, World!')
      const deref = dererenceDeep(value)
      const result = await deref()
      expect(result).toStrictEqual('Hello, World!')
    })

    it('should dereference a nested reference in a syncronous function', async() => {
      const value = new ivm.Reference(() => ({ hello: new ivm.Reference('world') }))
      const deref = dererenceDeep(value)
      const result = await deref()
      expect(result.hello).toStrictEqual('world')
    })

    it('should dereference a nested reference in an asyncronous function', async() => {
      const value = new ivm.Reference(() => Promise.resolve({ hello: new ivm.Reference('world') }))
      const deref = dererenceDeep(value)
      const result = await deref()
      expect(result.hello).toStrictEqual('world')
    })
  })
})
