import { createNode } from './createNode'
import { defineComponent } from './defineComponent'

describe('createNode', () => {
  const component = defineComponent({
    title: 'Example',
    process: async(context) => {
      context.result = { processed: true }
      return context.result
    },
  })

  it('should create a node with the given component', () => {
    const node = createNode(component)
    expect(node.component).toBe(component)
  })

  it('should process data using the component', async() => {
    const node = createNode(component)
    const result = await node.process({ input: 'data' })
    expect(result).toEqual({ processed: true })
  })

  it('should handle errors during processing', async() => {
    const errorComponent = defineComponent({
      title: 'ErrorExample',
      process: async() => {
        throw new Error('Processing error')
      },
    })
    const node = createNode(errorComponent)
    await node.process({ input: 'data' })
    expect(node.state).toBe('ERROR')
    expect(node.error).toBeInstanceOf(Error)
    expect(node.error?.message).toBe('Processing error')
  })

  it('should dispatch events during processing', async() => {
    const node = createNode(component)
    const startSpy = vi.fn()
    const endSpy = vi.fn()
    node.on('start', startSpy)
    node.on('end', endSpy)
    await node.process({ input: 'data' })
    expect(startSpy).toHaveBeenCalledOnce()
    expect(endSpy).toHaveBeenCalledOnce()
  })
})
