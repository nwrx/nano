import { createThread } from '../createThread'
import { addComponentInstance } from './addComponentInstance'
import { defineComponent } from './defineComponent'
import { resolveInputSocket } from './resolveInputSocket'

describe('resolveInputSocket', () => {
  const component = defineComponent({
    inputs: { foo: { type: 'string' } },
    outputs: { bar: { type: 'string' } },
  })

  it('should resolve an input socket', async() => {
    const thread = createThread({ componentResolvers: [() => component] })
    addComponentInstance(thread, { specifier: 'example', id: 'id' })
    const result = await resolveInputSocket(thread, 'id', 'foo')
    expect(result).toStrictEqual({ type: 'string' })
  })

  it('should throw an error if the node does not exist', async() => {
    const thread = createThread({ componentResolvers: [() => component] })
    const shouldReject = resolveInputSocket(thread, 'invalid', 'foo')
    await expect(shouldReject).rejects.toThrow('The node with ID "invalid" does not exist in the thread.')
  })

  it('should throw an error if the input socket does not exist', async() => {
    const thread = createThread({ componentResolvers: [() => component] })
    addComponentInstance(thread, { specifier: 'example', id: 'example' })
    const shouldReject = resolveInputSocket(thread, 'example', 'invalid')
    await expect(shouldReject).rejects.toThrow('The input socket "invalid" does not exist on node "example"')
  })

  it('should throw an error if the component cannot be resolved', async() => {
    const thread = createThread({ componentResolvers: [() => undefined] })
    addComponentInstance(thread, { specifier: 'example', id: 'example' })
    const shouldReject = resolveInputSocket(thread, 'example', 'foo')
    await expect(shouldReject).rejects.toThrow('The component with specifier "example" could not be resolved.')
  })
})
