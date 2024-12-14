/* eslint-disable vue/component-definition-name-casing */
import { defineComponent, SYMBOL_COMPONENT } from './defineComponent'

describe('defineComponent', () => {
  it('should define a component with the given options', () => {
    const component = defineComponent({
      name: 'example',
      version: '1.0.0',
      icon: 'https://example.com/icon.svg',
      title: 'Example Component',
      description: 'This is an example component.',
      inputs: { input1: { type: 'string' } },
      outputs: { output1: { type: 'string' } },
    })

    expect(component).toStrictEqual({
      [SYMBOL_COMPONENT]: true,
      name: 'example',
      version: '1.0.0',
      icon: 'https://example.com/icon.svg',
      title: 'Example Component',
      description: 'This is an example component.',
      inputs: { input1: { type: 'string' } },
      outputs: { output1: { type: 'string' } },
      process: undefined,
    })
  })

  it('should use the name as the title if the title is not provided', () => {
    const component = defineComponent({ name: 'example', version: '1.0.0' })
    expect(component.title).toBe('example')
  })

  it('should define a component with a process function', () => {
    const process = vi.fn()
    const component = defineComponent({ name: 'example', version: '1.0.0' }, process)
    expect(component.process).toBe(process)
  })
})
