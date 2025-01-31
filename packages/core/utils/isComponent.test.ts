import { defineComponent } from './defineComponent'
import { isComponent } from './isComponent'

describe('isComponent', () => {
  it('should return true for an object created with defineComponent', () => {
    const component = defineComponent({ name: 'Example' })
    const result = isComponent(component)
    expect(result).toBe(true)
  })

  it('should return false for object not created with defineComponent', () => {
    const result = isComponent({ name: 'example' })
    expect(result).toBe(false)
  })

  it('should return false for a non-object value', () => {
    const result = isComponent('string')
    expect(result).toBe(false)
  })

  it('should return false for a null value', () => {
    const result = isComponent(null)
    expect(result).toBe(false)
  })
})
