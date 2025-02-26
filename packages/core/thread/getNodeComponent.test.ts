import { defineComponent, ERRORS } from '../utils'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { getNodeComponent } from './getNodeComponent'

describe('getNodeComponent', () => {
  const component = defineComponent({})

  it('should return the component if it is already resolved', async() => {
    const resolver = vi.fn()
    const thread = createThread({ componentResolvers: [resolver] })
    const id = addNode(thread, 'example', { component })
    const result = await getNodeComponent(thread, id)
    expect(result).toBe(component)
    expect(resolver).not.toHaveBeenCalled()
  })

  it('should resolve the component if it is not already resolved', async() => {
    const resolver = vi.fn(() => component)
    const thread = createThread({ componentResolvers: [resolver] })
    const id = addNode(thread, 'example')
    const result = await getNodeComponent(thread, id)
    expect(result).toBe(component)
    expect(resolver).toHaveBeenCalled()
  })

  it('should set the resolved component on the component instance', async() => {
    const resolver = vi.fn(() => component)
    const thread = createThread({ componentResolvers: [resolver] })
    const id = addNode(thread, 'example')
    await getNodeComponent(thread, id)
    expect(thread.nodes.get(id)!.component).toBe(component)
  })

  it('should throw an error if every resolver returns undefined', async() => {
    const thread = createThread({ componentResolvers: [() => undefined] })
    const id = addNode(thread, 'example')
    const shouldReject = getNodeComponent(thread, id)
    const error = ERRORS.COMPONENT_NOT_RESOLVED({
      workspace: 'default',
      collection: 'default',
      tag: 'latest',
      name: 'example',
      registry: 'default',
    })
    await expect(shouldReject).rejects.toThrow(error)
  })
})
