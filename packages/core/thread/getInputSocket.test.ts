import { defineComponent } from '../utils'
import { add } from './add'
import { createThread } from './createThread'
import { getInputSocket } from './getInputSocket'

describe('getInputSocket', () => {
  const component = defineComponent({ inputs: { input: { type: 'string' } } })

  it('should return the input socket if it exists', async() => {
    const resolver = vi.fn(() => component)
    const thread = createThread({ componentResolvers: [resolver] })
    const id = add(thread, 'example')
    const result = await getInputSocket(thread, id, 'input')
    expect(result).toStrictEqual({ type: 'string' })
  })

  it('should throw an error if the input socket does not exist', async() => {
    const resolver = vi.fn(() => component)
    const thread = createThread({ componentResolvers: [resolver] })
    const id = add(thread, 'example')
    const shouldReject = getInputSocket(thread, id, 'invalid')
    await expect(shouldReject).rejects.toThrow(`The input socket "invalid" does not exist on node "${id}"`)
  })

  it('should throw an error if the component cannot be resolved', async() => {
    const thread = createThread({ componentResolvers: [] })
    const id = add(thread, 'example')
    const shouldReject = getInputSocket(thread, id, 'input')
    await expect(shouldReject).rejects.toThrow('The component with specifier "example" could not be resolved.')
  })
})
