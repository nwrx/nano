import { addNode, createThread, getNodeComponent, startNode } from '../../thread'
import { template } from './template'

describe('template component', () => {
  describe('templating', () => {
    it('should generate a value string based on the template and values', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'template')
      const result = await startNode(thread, nodeId, { template: 'Hello, {{ name }}!', values: { name: 'John' } })
      expect(result).toStrictEqual({ value: 'Hello, John!' })
    })

    it('should handle multiple placeholders that use the same value', async() => {
      // const result = await fixture({ template: '{{name}} is {{name}}!', values: { name: 'John' } })
      const thread = createThread()
      const nodeId = addNode(thread, 'template')
      const result = await startNode(thread, nodeId, { template: '{{name}} is {{name}}!', values: { name: 'John' } })
      expect(result).toStrictEqual({ value: 'John is John!' })
    })

    it('should handle multiple placeholders that use different values', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'template')
      const result = await startNode(thread, nodeId, { template: '{{name}} is {{age}} years old.', values: { name: 'John', age: 42 } })
      expect(result).toStrictEqual({ value: 'John is 42 years old.' })
    })
  })

  describe('optional values', () => {
    it('should replace missing values with an empty string', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'template')
      const result = await startNode(thread, nodeId, { template: 'Hello, {{name?}}!', values: {} })
      expect(result).toStrictEqual({ value: 'Hello, !' })
    })

    it('should declare as optional even if there are whitespaces', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'template')
      const result = await startNode(thread, nodeId, { template: 'Hello, {{ \t\n\rname \t\n\r? \t\n\r}}!', values: {} })
      expect(result).toStrictEqual({ value: 'Hello, !' })
    })
  })

  describe('default values', () => {
    it('should replace missing values with the default value when using quotes', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'template')
      const result = await startNode(thread, nodeId, { template: 'Hello, {{name??\'World\'}}!', values: {} })
      expect(result).toStrictEqual({ value: 'Hello, World!' })
    })

    it('should replace missing values with the default value when using double quotes', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'template')
      const result = await startNode(thread, nodeId, { template: 'Hello, {{name??"World"}}!', values: {} })
      expect(result).toStrictEqual({ value: 'Hello, World!' })
    })

    it('should replace missing values with the default value when using no quotes', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'template')
      const result = await startNode(thread, nodeId, { template: 'Hello, {{name??World}}!', values: {} })
      expect(result).toStrictEqual({ value: 'Hello, World!' })
    })
  })

  describe('casting', () => {
    it('should cast a number to a string', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'template')
      const result = await startNode(thread, nodeId, { template: 'I am {{age}} years old.', values: { age: 42 } })
      expect(result).toStrictEqual({ value: 'I am 42 years old.' })
    })

    it('should cast a boolean to a string', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'template')
      const result = await startNode(thread, nodeId, { template: 'I am {{isHappy}}.', values: { isHappy: true } })
      expect(result).toStrictEqual({ value: 'I am true.' })
    })
  })

  describe('edge cases', () => {
    it('should throw an error if the template is unbalanced', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'template')
      const shouldThrow = startNode(thread, nodeId, { template: 'Hello, {{ name!', values: { name: 'John' } })
      const error = new Error('Unbalanced placeholder: missing "}}"')
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should throw an error if one of the required values is not provided', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'template')
      const shouldThrow = startNode(thread, nodeId, { template: 'Hello, {{ name }}!', values: {} })
      const error = new Error('Input "name" is required but was not provided.')
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })

  describe('native component', () => {
    it('should be included in the native components', async() => {
      const thread = createThread()
      const id = addNode(thread, 'template')
      const component = await getNodeComponent(thread, id)
      expect(component).toStrictEqual(template)
    })
  })
})
