import { addNode } from './addNode'
import { createThread } from './createThread'
import { getNode } from './getNode'
import { setNodeInputValue } from './setNodeInputValue'

describe('setNodeInputValue', () => {
  it('should set the input value on the component instance', () => {
    const thread = createThread()
    const id = addNode(thread, 'example', { input: {} })
    setNodeInputValue(thread, id, 'inputName', 'inputValue')
    const componentInstance = getNode(thread, id)
    expect(componentInstance.input).toStrictEqual({ inputName: 'inputValue' })
  })

  it('should initialize the input object if it does not exist', () => {
    const thread = createThread()
    const id = addNode(thread, 'example')
    setNodeInputValue(thread, id, 'inputName', 'inputValue')
    const componentInstance = getNode(thread, id)
    expect(componentInstance.input).toStrictEqual({ inputName: 'inputValue' })
  })

  it('should overwrite the existing input value', () => {
    const thread = createThread()
    const id = addNode(thread, 'example', { input: { inputName: 'oldValue' } })
    setNodeInputValue(thread, id, 'inputName', 'newValue')
    const componentInstance = getNode(thread, id)
    expect(componentInstance.input).toStrictEqual({ inputName: 'newValue' })
  })
})
