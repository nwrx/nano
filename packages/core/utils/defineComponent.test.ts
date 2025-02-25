import { defineComponent, SYMBOL_COMPONENT } from './defineComponent'

describe('defineComponent', () => {
  it('should define a component with the given options', () => {
    const component = defineComponent({
      inputs: { input1: { type: 'string' } },
      outputs: { output1: { type: 'string' } },
      isTrusted: true,
      isToolSet: false,
      // @ts-expect-error: Make sure the `proces` property is not used.
      process: vi.fn(),
    })

    expect(component).toStrictEqual({
      ['@instanceOf']: SYMBOL_COMPONENT,
      inputs: { input1: { type: 'string' } },
      outputs: { output1: { type: 'string' } },
      isTrusted: true,
      isToolSet: false,
      process: undefined,
    })
  })

  it('should define a component with a process function', () => {
    const process = vi.fn()
    const component = defineComponent({}, process)
    expect(component).toStrictEqual({
      ['@instanceOf']: SYMBOL_COMPONENT,
      process,
      inputs: undefined,
      outputs: undefined,
      isTrusted: undefined,
      isToolSet: undefined,
    })
  })
})
