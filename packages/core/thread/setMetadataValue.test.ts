import { add } from './add'
import { createThread } from './createThread'
import { getInstance } from './getInstance'
import { setMetadataValue } from './setMetadataValue'

describe('setMetadataValue', () => {
  it('should set the input value on the component instance', () => {
    const thread = createThread()
    const id = add(thread, 'example', { metadata: {} })
    setMetadataValue(thread, id, 'key', 'value')
    const componentInstance = getInstance(thread, id)
    expect(componentInstance.metadata).toStrictEqual({ key: 'value' })
  })

  it('should initialize the input object if it does not exist', () => {
    const thread = createThread()
    const id = add(thread, 'example')
    setMetadataValue(thread, id, 'key', 'value')
    const componentInstance = getInstance(thread, id)
    expect(componentInstance.metadata).toStrictEqual({ key: 'value' })
  })

  it('should overwrite the existing input value', () => {
    const thread = createThread()
    const id = add(thread, 'example', { metadata: { key: 'oldValue' } })
    setMetadataValue(thread, id, 'key', 'newValue')
    const componentInstance = getInstance(thread, id)
    expect(componentInstance.metadata).toStrictEqual({ key: 'newValue' })
  })
})
