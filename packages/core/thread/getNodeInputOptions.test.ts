/* eslint-disable vue/component-definition-name-casing */
import { defineComponent, ERRORS } from '../utils'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { getNodeInputOptions } from './getNodeInputOptions'

describe('getNodeInputOptions', () => {
  const componentResolvers = [
    () => defineComponent({
      name: 'example',
      inputs: {
        enumInput: {
          type: 'string',
          enum: ['option1', 'option2'],
        },
        oneOfInput: {
          type: 'string',
          oneOf: [
            { enum: ['optionA'], title: 'Option A' },
            { enum: ['optionB'], title: 'Option B' },
          ],
        },
        simpleValue: { type: 'string' },
      },
    }),
  ]

  it('should return options from enum', async() => {
    const thread = createThread({ componentResolvers })
    const nodeId = addNode(thread, 'example')
    const options = await getNodeInputOptions(thread, nodeId, 'enumInput')
    expect(options).toStrictEqual([
      { value: 'option1', label: 'option1', icon: undefined, description: undefined },
      { value: 'option2', label: 'option2', icon: undefined, description: undefined },
    ])
  })

  it('should return options from oneOf', async() => {
    const thread = createThread({ componentResolvers })
    const nodeId = addNode(thread, 'example')
    const options = await getNodeInputOptions(thread, nodeId, 'oneOfInput')
    expect(options).toStrictEqual([
      { value: 'optionA', label: 'Option A', description: undefined, icon: undefined },
      { value: 'optionB', label: 'Option B', description: undefined, icon: undefined },
    ])
  })

  it('should return an empty array if no options are available', async() => {
    const thread = createThread({ componentResolvers })
    const nodeId = addNode(thread, 'example')
    const options = await getNodeInputOptions(thread, nodeId, 'simpleValue')
    expect(options).toStrictEqual([])
  })

  it('should throw an error if the input does not exist', async() => {
    const thread = createThread({ componentResolvers })
    const nodeId = addNode(thread, 'example')
    const shouldReject = getNodeInputOptions(thread, nodeId, 'nonExistentInput')
    const error = ERRORS.NODE_INPUT_SOCKET_NOT_FOUND(nodeId, 'nonExistentInput')
    await expect(shouldReject).rejects.toThrow(error)
  })
})
