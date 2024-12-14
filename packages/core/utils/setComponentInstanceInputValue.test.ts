import { createThread } from '../createThread'
import { addComponentInstance } from './addComponentInstance'
import { getComponentInstance } from './getComponentInstance'
import { setComponentInstanceInputValue } from './setComponentInstanceInputValue'

describe('setComponentInstanceInputValue', () => {
  it('should set the input value on the component instance', () => {
    const thread = createThread()
    addComponentInstance(thread, { specifier: 'example', id: 'example', input: {} })
    setComponentInstanceInputValue(thread, 'example', 'inputName', 'inputValue')
    const componentInstance = getComponentInstance(thread, 'example')
    expect(componentInstance.input).toStrictEqual({ inputName: 'inputValue' })
  })

  it('should initialize the input object if it does not exist', () => {
    const thread = createThread()
    addComponentInstance(thread, { specifier: 'example', id: 'example' })
    setComponentInstanceInputValue(thread, 'example', 'inputName', 'inputValue')
    const componentInstance = getComponentInstance(thread, 'example')
    expect(componentInstance.input).toStrictEqual({ inputName: 'inputValue' })
  })

  it('should overwrite the existing input value', () => {
    const thread = createThread()
    addComponentInstance(thread, { specifier: 'example', id: 'example', input: { inputName: 'oldValue' } })
    setComponentInstanceInputValue(thread, 'example', 'inputName', 'newValue')
    const componentInstance = getComponentInstance(thread, 'example')
    expect(componentInstance.input).toStrictEqual({ inputName: 'newValue' })
  })
})
