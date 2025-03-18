import { createThreadFromFlow } from './createThreadFromFlow'
import { getOutputSchema } from './getOutputSchema'

describe('getOutputSchema', () => {
  it('should collect output nodes by default', () => {
    const thread = createThreadFromFlow({
      version: '1',
      nodes: {
        output1: { component: 'output' },
        output2: { component: 'output' },
      },
    })
    const schema = getOutputSchema(thread)
    expect(schema).toStrictEqual({
      output1: { type: 'string' },
      output2: { type: 'string' },
    })
  })

  it('should return an empty object when no output nodes are found', () => {
    const thread = createThreadFromFlow({
      version: '1',
      nodes: {
        input1: { component: 'input' },
        input2: { component: 'input' },
      },
    })
    const schema = getOutputSchema(thread)
    expect(schema).toStrictEqual({})
  })

  it('should collect output nodes based on custom specifiers', () => {
    const thread = createThreadFromFlow({
      version: '1',
      nodes: {
        output1: { component: 'test/custom1' },
        output2: { component: 'test/custom2' },
      },
    })
    const schema = getOutputSchema(thread, { outputSpecifiers: ['test/custom1', 'test/custom2'] })
    expect(schema).toStrictEqual({
      output1: { type: 'string' },
      output2: { type: 'string' },
    })
  })
})
