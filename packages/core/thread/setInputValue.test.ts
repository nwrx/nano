import { add } from './add'
import { createThread } from './createThread'
import { getInstance } from './getInstance'
import { setInputValue } from './setInputValue'

describe('setInputValue', () => {
  it('should set the input value on the component instance', () => {
    const thread = createThread()
    const id = add(thread, 'example', { input: {} })
    setInputValue(thread, id, 'inputName', 'inputValue')
    const componentInstance = getInstance(thread, id)
    expect(componentInstance.input).toStrictEqual({ inputName: 'inputValue' })
  })

  it('should initialize the input object if it does not exist', () => {
    const thread = createThread()
    const id = add(thread, 'example')
    setInputValue(thread, id, 'inputName', 'inputValue')
    const componentInstance = getInstance(thread, id)
    expect(componentInstance.input).toStrictEqual({ inputName: 'inputValue' })
  })

  it('should overwrite the existing input value', () => {
    const thread = createThread()
    const id = add(thread, 'example', { input: { inputName: 'oldValue' } })
    setInputValue(thread, id, 'inputName', 'newValue')
    const componentInstance = getInstance(thread, id)
    expect(componentInstance.input).toStrictEqual({ inputName: 'newValue' })
  })
})
