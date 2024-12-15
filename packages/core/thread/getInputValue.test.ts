import { defineComponent } from '../utils'
import { add } from './add'
import { createThread } from './createThread'
import { getInputValue } from './getInputValue'

describe('getInputValue', () => {
  const component = defineComponent({})

  it('should return the input value if it exists', () => {
    const thread = createThread()
    const id = add(thread, 'example', { input: { value: 'value' } })
    const result = getInputValue(thread, id, 'value')
    expect(result).toBe('value')
  })

  it('should return undefined if the input value is not set', () => {
    const thread = createThread()
    const id = add(thread, 'example', { component })
    const result = getInputValue(thread, id, 'value')
    expect(result).toBeUndefined()
  })
})
