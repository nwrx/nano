import { defineComponent } from '../utils'
import { add } from './add'
import { createThread } from './createThread'
import { getComponent } from './getComponent'

describe('getComponent', () => {
  const component = defineComponent({})

  it('should return the component if it is already resolved', async() => {
    const resolver = vi.fn()
    const thread = createThread({ componentResolvers: [resolver] })
    const id = add(thread, 'example', { component })
    const result = await getComponent(thread, id)
    expect(result).toBe(component)
    expect(resolver).not.toHaveBeenCalled()
  })

  it('should resolve the component if it is not already resolved', async() => {
    const resolver = vi.fn(() => component)
    const thread = createThread({ componentResolvers: [resolver] })
    const id = add(thread, 'example')
    const result = await getComponent(thread, id)
    expect(result).toBe(component)
    expect(resolver).toHaveBeenCalled()
  })

  it('should set the resolved component on the component instance', async() => {
    const resolver = vi.fn(() => component)
    const thread = createThread({ componentResolvers: [resolver] })
    const id = add(thread, 'example')
    await getComponent(thread, id)
    expect(thread.componentInstances.get(id)!.component).toBe(component)
  })

  it('should throw an error if the component cannot be resolved', async() => {
    const thread = createThread({ componentResolvers: [] })
    const id = add(thread, 'example')
    const shouldReject = getComponent(thread, id)
    await expect(shouldReject).rejects.toThrow('The component with specifier "example" could not be resolved.')
  })
})
