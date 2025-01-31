import { defineComponent, SYMBOL_COMPONENT } from './defineComponent'

describe('defineComponent', () => {
  it('should define a component with the given options', () => {
    const component = defineComponent({
      icon: 'https://example.com/icon.svg',
      title: 'Example Component',
      description: 'This is an example component.',
      inputs: { input1: { type: 'string' } },
      outputs: { output1: { type: 'string' } },
      isTrusted: true,
      // @ts-expect-error: Make sure the `proces` property is not used.
      process: vi.fn(),
    })

    expect(component).toStrictEqual({
      ['@instanceOf']: SYMBOL_COMPONENT,
      icon: 'https://example.com/icon.svg',
      title: 'Example Component',
      description: 'This is an example component.',
      inputs: { input1: { type: 'string' } },
      outputs: { output1: { type: 'string' } },
      isTrusted: true,
      process: undefined,
    })
  })

  it('should define a component with a process function', () => {
    const process = vi.fn()
    const component = defineComponent({}, process)
    expect(component).toStrictEqual({
      ['@instanceOf']: SYMBOL_COMPONENT,
      process,
      description: undefined,
      icon: undefined,
      inputs: undefined,
      outputs: undefined,
      isTrusted: undefined,
      title: undefined,
    })
  })
})
