import { addNode } from './addNode'
import { createThread } from './createThread'
import { serialize } from './serialize'

describe('serializeThread', () => {
  it('should serialize a thread without metadata', () => {
    const thread = createThread()
    const result = serialize(thread)
    expect(result).toStrictEqual({
      version: '1',
      metadata: {},
      nodes: {},
    })
  })

  it('should serialize a thread with metadata', () => {
    const thread = createThread()
    const result = serialize(thread, { name: 'Hello, World!' })
    expect(result).toEqual({
      version: '1',
      metadata: { name: 'Hello, World!' },
      nodes: {},
    })
  })

  it('should serialize a thread with components', () => {
    const thread = createThread()
    const id1 = addNode(thread, 'custom/component-one')
    const id2 = addNode(thread, 'custom/component-two')
    const result = serialize(thread)
    expect(result).toEqual({
      version: '1',
      metadata: {},
      nodes: {
        [id1]: { specifier: 'custom/component-one' },
        [id2]: { specifier: 'custom/component-two' },
      },
    })
  })

  it('should serialize a thread where components have inputs', () => {
    const thread = createThread()
    const id1 = addNode(thread, 'custom/component-one', { input: { foo: 'bar' } })
    const id2 = addNode(thread, 'custom/component-two', { input: { baz: 'qux' } })
    const result = serialize(thread)
    expect(result).toEqual({
      version: '1',
      metadata: {},
      nodes: {
        [id1]: { specifier: 'custom/component-one', foo: 'bar' },
        [id2]: { specifier: 'custom/component-two', baz: 'qux' },
      },
    })
  })

  it('should serialize a thread where components have metadata', () => {
    const thread = createThread()
    const id1 = addNode(thread, 'custom/component-one', { metadata: { foo: 'bar' } })
    const id2 = addNode(thread, 'custom/component-two', { metadata: { baz: 'qux' } })
    const result = serialize(thread)
    expect(result).toEqual({
      version: '1',
      metadata: {},
      nodes: {
        [id1]: { specifier: 'custom/component-one', _foo: 'bar' },
        [id2]: { specifier: 'custom/component-two', _baz: 'qux' },
      },
    })
  })
})
