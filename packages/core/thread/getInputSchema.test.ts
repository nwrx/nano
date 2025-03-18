import { createThreadFromFlow } from './createThreadFromFlow'
import { getInputSchema } from './getInputSchema'

describe('getInputSchema', () => {
  it('should collect input nodes by default', () => {
    const thread = createThreadFromFlow({
      version: '1',
      nodes: {
        input1: { component: 'input' },
        input2: { component: 'input' },
      },
    })
    const schema = getInputSchema(thread)
    expect(schema).toStrictEqual({
      input1: { type: 'string' },
      input2: { type: 'string' },
    })
  })

  it('should return an empty object when no input nodes are found', () => {
    const thread = createThreadFromFlow({
      version: '1',
      nodes: {
        output1: { component: 'output' },
        output2: { component: 'output' },
      },
    })
    const schema = getInputSchema(thread)
    expect(schema).toStrictEqual({})
  })

  it('should collect input nodes based on custom specifiers', () => {
    const thread = createThreadFromFlow({
      version: '1',
      nodes: {
        input1: { component: 'test/custom1' },
        input2: { component: 'test/custom2' },
      },
    })
    const schema = getInputSchema(thread, { inputSpecifiers: ['test/custom1', 'test/custom2'] })
    expect(schema).toStrictEqual({
      input1: { type: 'string' },
      input2: { type: 'string' },
    })
  })
})
