import { addNode, createThread, getNodeComponent, startNode } from '../../thread'
import { ERRORS as E } from '../../utils'
import { gate } from './gate'

describe('gate', () => {
  describe('conditions', () => {
    describe('AND condition', () => {
      it('should route value to pass when all values are true', async() => {
        const thread = createThread()
        const nodeId = addNode(thread, 'gate')
        const result = await startNode(thread, nodeId, { condition: 'and', values: [true, true], passthrough: 'value' })
        expect(result).toStrictEqual({ pass: 'value', fail: undefined })
      })

      it('should route value to fail when not all values are true', async() => {
        const thread = createThread()
        const nodeId = addNode(thread, 'gate')
        const result = await startNode(thread, nodeId, { condition: 'and', values: [true, false], passthrough: 'value' })
        expect(result).toStrictEqual({ pass: undefined, fail: 'value' })
      })
    })

    describe('OR condition', () => {
      it('should route value to pass when any value is true', async() => {
        const thread = createThread()
        const nodeId = addNode(thread, 'gate')
        const result = await startNode(thread, nodeId, { condition: 'or', values: [false, true], passthrough: 'value' })
        expect(result).toStrictEqual({ pass: 'value', fail: undefined })
      })

      it('should route value to fail when no values are true', async() => {
        const thread = createThread()
        const nodeId = addNode(thread, 'gate')
        const result = await startNode(thread, nodeId, { condition: 'or', values: [false, false], passthrough: 'value' })
        expect(result).toStrictEqual({ pass: undefined, fail: 'value' })
      })
    })

    describe('XOR condition', () => {
      it('should route value to pass when only one value is true', async() => {
        const thread = createThread()
        const nodeId = addNode(thread, 'gate')
        const result = await startNode(thread, nodeId, { condition: 'xor', values: [true, false], passthrough: 'value' })
        expect(result).toStrictEqual({ pass: 'value', fail: undefined })
      })

      it('should route value to fail when more than one value is true', async() => {
        const thread = createThread()
        const nodeId = addNode(thread, 'gate')
        const result = await startNode(thread, nodeId, { condition: 'xor', values: [true, true], passthrough: 'value' })
        expect(result).toStrictEqual({ pass: undefined, fail: 'value' })
      })
    })

    describe('NAND condition', () => {
      it('should route value to pass when not all values are true', async() => {
        const thread = createThread()
        const nodeId = addNode(thread, 'gate')
        const result = await startNode(thread, nodeId, { condition: 'nand', values: [true, false], passthrough: 'value' })
        expect(result).toStrictEqual({ pass: 'value', fail: undefined })
      })

      it('should route value to fail when all values are true', async() => {
        const thread = createThread()
        const nodeId = addNode(thread, 'gate')
        const result = await startNode(thread, nodeId, { condition: 'nand', values: [true, true], passthrough: 'value' })
        expect(result).toStrictEqual({ pass: undefined, fail: 'value' })
      })
    })

    describe('NOR condition', () => {
      it('should route value to pass when no values are true', async() => {
        const thread = createThread()
        const nodeId = addNode(thread, 'gate')
        const result = await startNode(thread, nodeId, { condition: 'nor', values: [false, false], passthrough: 'value' })
        expect(result).toStrictEqual({ pass: 'value', fail: undefined })
      })

      it('should route value to fail when any value is true', async() => {
        const thread = createThread()
        const nodeId = addNode(thread, 'gate')
        const result = await startNode(thread, nodeId, { condition: 'nor', values: [true, false], passthrough: 'value' })
        expect(result).toStrictEqual({ pass: undefined, fail: 'value' })
      })
    })

    describe('XNOR condition', () => {
      it('should route value to pass when all values are the same', async() => {
        const thread = createThread()
        const nodeId = addNode(thread, 'gate')
        const result = await startNode(thread, nodeId, { condition: 'xnor', values: [true, true], passthrough: 'value' })
        expect(result).toStrictEqual({ pass: 'value', fail: undefined })
      })

      it('should route value to fail when values are not the same', async() => {
        const thread = createThread()
        const nodeId = addNode(thread, 'gate')
        const result = await startNode(thread, nodeId, { condition: 'xnor', values: [true, false], passthrough: 'value' })
        expect(result).toStrictEqual({ pass: undefined, fail: 'value' })
      })
    })
  })

  describe('passthrough', () => {
    it('should passthrough "true" by default', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'gate', { input: { condition: 'and', values: [true] } })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ pass: true, fail: undefined })
    })

    it('should passthrough a string', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'gate', { input: { condition: 'and', values: [true], passthrough: 'hello' } })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ pass: 'hello', fail: undefined })
    })

    it('should passthrough a number', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'gate', { input: { condition: 'and', values: [true], passthrough: 42 } })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ pass: 42, fail: undefined })
    })

    it('should passthrough a boolean', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'gate', { input: { condition: 'and', values: [true], passthrough: true } })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ pass: true, fail: undefined })
    })

    it('should passthrough an object', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'gate', { input: { condition: 'and', values: [true], passthrough: { name: 'John' } } })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ pass: { name: 'John' }, fail: undefined })
    })

    it('should passthrough an array', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'gate', { input: { condition: 'and', values: [true], passthrough: ['John'] } })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ pass: ['John'], fail: undefined })
    })

    it('should passthrough a stream', async() => {
      const thread = createThread()
      const stream = new ReadableStream()
      const nodeId = addNode(thread, 'gate', { input: { condition: 'and', values: [true], passthrough: stream } })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ pass: stream, fail: undefined })
    })
  })

  describe('native component', () => {
    it('should be included in the native components', async() => {
      const thread = createThread()
      const id = addNode(thread, 'gate')
      const component = await getNodeComponent(thread, id)
      expect(component).toStrictEqual(gate)
    })
  })

  describe('schema validation', () => {
    it('should throw if the condition is not supported', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'gate', { input: { condition: 'unknown', values: [true], passthrough: 'value' } })
      const shouldReject = startNode(thread, nodeId)
      const error = E.NODE_INPUT_SCHEMA_MISMATCH(nodeId, { condition: E.INPUT_NOT_IN_ENUM('condition', ['and', 'or', 'xor', 'nand', 'nor', 'xnor']) })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the values are not an array of booleans', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'gate', { input: { condition: 'and', values: 'not-an-array', passthrough: 'value' } })
      const shouldReject = startNode(thread, nodeId)
      const error = E.NODE_INPUT_SCHEMA_MISMATCH(nodeId, { values: E.INPUT_NOT_ARRAY('values') })
      await expect(shouldReject).rejects.toThrow(error)
    })
  })
})
