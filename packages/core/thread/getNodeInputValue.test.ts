import { defineComponent } from '../utils'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { getNodeInputValue } from './getNodeInputValue'

describe('getNodeInputValue', () => {
  const component = defineComponent({})

  it('should return the input value if it exists', () => {
    const thread = createThread()
    const id = addNode(thread, 'example', { input: { value: 'value' } })
    const result = getNodeInputValue(thread, id, 'value')
    expect(result).toBe('value')
  })

  it('should return undefined if the input value is not set', () => {
    const thread = createThread()
    const id = addNode(thread, 'example', { component })
    const result = getNodeInputValue(thread, id, 'value')
    expect(result).toBeUndefined()
  })
})
