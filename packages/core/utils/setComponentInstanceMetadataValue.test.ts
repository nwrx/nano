import { createThread } from '../createThread'
import { addComponentInstance } from './addComponentInstance'
import { getComponentInstance } from './getComponentInstance'
import { setComponentInstanceMetadataValue } from './setComponentInstanceMetadataValue'

describe('setComponentInstanceMetadataValue', () => {
  it('should set the input value on the component instance', () => {
    const thread = createThread()
    addComponentInstance(thread, { specifier: 'example', id: 'example', metadata: {} })
    setComponentInstanceMetadataValue(thread, 'example', 'key', 'value')
    const componentInstance = getComponentInstance(thread, 'example')
    expect(componentInstance.metadata).toStrictEqual({ key: 'value' })
  })

  it('should initialize the input object if it does not exist', () => {
    const thread = createThread()
    addComponentInstance(thread, { specifier: 'example', id: 'example' })
    setComponentInstanceMetadataValue(thread, 'example', 'key', 'value')
    const componentInstance = getComponentInstance(thread, 'example')
    expect(componentInstance.metadata).toStrictEqual({ key: 'value' })
  })

  it('should overwrite the existing input value', () => {
    const thread = createThread()
    addComponentInstance(thread, { specifier: 'example', id: 'example', metadata: { key: 'oldValue' } })
    setComponentInstanceMetadataValue(thread, 'example', 'key', 'newValue')
    const componentInstance = getComponentInstance(thread, 'example')
    expect(componentInstance.metadata).toStrictEqual({ key: 'newValue' })
  })
})
