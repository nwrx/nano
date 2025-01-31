import { addNode } from './addNode'
import { createThread } from './createThread'
import { getNode } from './getNode'
import { setNodeMetadataValue } from './setNodeMetadataValue'

describe('setNodeMetadataValue', () => {
  it('should set the input value on the component instance', () => {
    const thread = createThread()
    const id = addNode(thread, 'example', { metadata: {} })
    setNodeMetadataValue(thread, id, 'key', 'value')
    const componentInstance = getNode(thread, id)
    expect(componentInstance.metadata).toStrictEqual({ key: 'value' })
  })

  it('should initialize the input object if it does not exist', () => {
    const thread = createThread()
    const id = addNode(thread, 'example')
    setNodeMetadataValue(thread, id, 'key', 'value')
    const componentInstance = getNode(thread, id)
    expect(componentInstance.metadata).toStrictEqual({ key: 'value' })
  })

  it('should overwrite the existing input value', () => {
    const thread = createThread()
    const id = addNode(thread, 'example', { metadata: { key: 'oldValue' } })
    setNodeMetadataValue(thread, id, 'key', 'newValue')
    const componentInstance = getNode(thread, id)
    expect(componentInstance.metadata).toStrictEqual({ key: 'newValue' })
  })
})
