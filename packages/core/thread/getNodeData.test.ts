import { defineComponent, ERRORS as E } from '../utils'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { getNodeData } from './getNodeData'

describe('getNodeData', () => {
  const component = defineComponent({
    inputs: {
      name: { type: 'string' },
      age: { type: 'number' },
    },
  })

  it('should resolve input data correctly', async() => {
    const thread = createThread()
    const id = addNode(thread, 'example', { component, input: { name: 'John Doe', age: 30 } })
    const data = await getNodeData(thread, id)
    expect(data).toStrictEqual({ name: 'John Doe', age: 30 })
  })

  it('should resolve references in input data', async() => {
    const thread = createThread({ referenceResolvers: [() => 30] })
    const id = addNode(thread, 'example', { component, input: { name: 'John Doe', age: { $ref: '#/Variables/age' } } })
    const data = await getNodeData(thread, id)
    expect(data).toStrictEqual({ name: 'John Doe', age: 30 })
  })

  it('should skip errors if skipErrors option is true', async() => {
    const thread = createThread()
    const id = addNode(thread, 'example', { component, input: { name: 'John Doe', age: 'invalid' } })
    const data = await getNodeData(thread, id, { skipErrors: true })
    expect(data).toStrictEqual({ name: 'John Doe' })
  })

  it('should throw an error if input schema does not match and skipErrors is false', async() => {
    const thread = createThread()
    const id = addNode(thread, 'example', { component, input: { name: 'John Doe', age: 'invalid' } })
    const shouldReject = getNodeData(thread, id)
    const error = E.NODE_INPUT_SCHEMA_MISMATCH(id, { age: E.INPUT_NOT_NUMBER('age') })
    await expect(shouldReject).rejects.toThrow(error)
  })
})
