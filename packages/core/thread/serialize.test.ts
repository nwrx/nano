import { add } from './add'
import { createThread } from './createThread'
import { serialize } from './serialize'

describe('serializeThread', () => {
  it('should serialize a thread without metadata', () => {
    const thread = createThread()
    const result = serialize(thread)
    expect(result).toStrictEqual({
      version: '1',
      components: {},
      metadata: {},
    })
  })

  it('should serialize a thread with metadata', () => {
    const thread = createThread()
    const result = serialize(thread, { name: 'Hello, World!' })
    expect(result).toEqual({
      version: '1',
      components: {},
      metadata: { name: 'Hello, World!' },
    })
  })

  it('should serialize a thread with components', () => {
    const thread = createThread()
    const id1 = add(thread, 'component-1')
    const id2 = add(thread, 'component-2')
    const result = serialize(thread)
    expect(result).toEqual({
      version: '1',
      metadata: {},
      components: {
        [id1]: { specifier: 'component-1' },
        [id2]: { specifier: 'component-2' },
      },
    })
  })

  it('should serialize a thread where components have inputs', () => {
    const thread = createThread()
    const id1 = add(thread, 'component-1', { input: { foo: 'bar' } })
    const id2 = add(thread, 'component-2', { input: { baz: 'qux' } })
    const result = serialize(thread)
    expect(result).toEqual({
      version: '1',
      metadata: {},
      components: {
        [id1]: { specifier: 'component-1', foo: 'bar' },
        [id2]: { specifier: 'component-2', baz: 'qux' },
      },
    })
  })

  it('should serialize a thread where components have metadata', () => {
    const thread = createThread()
    const id1 = add(thread, 'component-1', { metadata: { foo: 'bar' } })
    const id2 = add(thread, 'component-2', { metadata: { baz: 'qux' } })
    const result = serialize(thread)
    expect(result).toEqual({
      version: '1',
      metadata: {},
      components: {
        [id1]: { specifier: 'component-1', _foo: 'bar' },
        [id2]: { specifier: 'component-2', _baz: 'qux' },
      },
    })
  })
})
