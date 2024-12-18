import { createReference, defineComponent, ERRORS } from '../utils'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { getNodeInputOptions } from './getNodeInputOptions'
import { getNodeInputSocket } from './getNodeInputSocket'

describe('getNodeInputOptions', () => {
  const componentResolvers = [
    () => defineComponent({
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
        optionsInput: {
          'type': 'string',
          'x-options': vi.fn(() => [
            {
              'value': 'dynamic1',
              'label': 'Dynamic 1',
              'description': 'Description',
              'x-icon': 'icon',
            },
            {
              'value': 'dynamic2',
              'label': 'Dynamic 2',
              'description': 'Description',
              'x-icon': 'icon',
            },
          ]),
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
      { value: 'option1', label: 'option1' },
      { value: 'option2', label: 'option2' },
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

  it('should return options from x-options', async() => {
    const thread = createThread({ componentResolvers })
    const nodeId = addNode(thread, 'example')
    const options = await getNodeInputOptions(thread, nodeId, 'optionsInput')
    expect(options).toStrictEqual([
      {
        'description': 'Description',
        'label': 'Dynamic 1',
        'value': 'dynamic1',
        'x-icon': 'icon',
      },
      {
        'description': 'Description',
        'label': 'Dynamic 2',
        'value': 'dynamic2',
        'x-icon': 'icon',
      },
    ])
  })

  it('should pass the resolved data to the "x-options" function', async() => {
    const thread = createThread({ componentResolvers, referenceResolvers: [() => 'VariableValue'] })
    const nodeId = addNode(thread, 'example', { input: { optionsInput: createReference('Variables', 'VARIABLE') } })
    await getNodeInputOptions(thread, nodeId, 'optionsInput')
    const socket = await getNodeInputSocket(thread, nodeId, 'optionsInput')
    expect(socket['x-options']).toHaveBeenCalledWith({ optionsInput: 'VariableValue' }, undefined)
  })

  it('should pass the query to the "x-options" function', async() => {
    const thread = createThread({ componentResolvers })
    const nodeId = addNode(thread, 'example')
    await getNodeInputOptions(thread, nodeId, 'optionsInput', 'query')
    const socket = await getNodeInputSocket(thread, nodeId, 'optionsInput')
    expect(socket['x-options']).toHaveBeenCalledWith({}, 'query')
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
    const error = ERRORS.NODE_SOCKET_NOT_FOUND(nodeId, 'nonExistentInput')
    await expect(shouldReject).rejects.toThrow(error)
  })
})
