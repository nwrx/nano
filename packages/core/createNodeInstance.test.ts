/* eslint-disable sonarjs/no-duplicate-string */
import { nextTick } from 'node:process'
import { typeBoolean, typeString } from './__fixtures__'
import { createFlow } from './createFlow'
import { createFlowNodeInstance } from './createNodeInstance'
import { defineNode } from './defineNode'
import { defineType } from './defineType'

describe('createFlowNodeInstance', () => {
  describe('createFlowNodeInstance', () => {
    it('should store the flow and the node definition', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.flow).toBe(flow)
      expect(instance.node).toBe(node)
    })

    it('should store the id', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node, id: 'node' })
      expect(instance.id).toBe('node')
    })

    it('should automatically generate an UUID for the id if not provided', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.id).toMatch(/[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}/)
    })

    it('should pass the initial raw data if provided', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node, initialData: { string: 'Hello, World!' } })
      expect(instance.dataRaw).toStrictEqual({ string: 'Hello, World!' })
    })

    it('should not pass the initial raw data reference', () => {
      using flow = createFlow()
      const initialData = { string: 'Hello, World!' }
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node, initialData })
      expect(instance.dataRaw).not.toBe(initialData)
    })

    it('should pass the initial result if provided', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node, initialResult: { boolean: false } })
      expect(instance.result).toStrictEqual({ boolean: false })
    })

    it('should not pass the initial result reference', () => {
      using flow = createFlow()
      const initialResult = { boolean: false }
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node, initialResult })
      expect(instance.result).not.toBe(initialResult)
    })
  })

  describe('eventTarget', () => {
    it('should dispatch an event and call the listener', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.dispatch('data', { string: 'Hello, World!' })
      expect(listener).toHaveBeenCalledWith({ string: 'Hello, World!' })
    })

    it('should remove the listener when disposed', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance[Symbol.dispose]()
      instance.dispatch('data', { string: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })

    it('should remove the listener when calling the return value of on', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      const removeListener = instance.on('data', listener)
      removeListener()
      instance.dispatch('data', { string: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('resolveDataSchema', () => {
    it('should resolve the data schema imedialety if the initial data schema is an object', () => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineNode({ kind: 'core:example', dataSchema: { string: port } })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.dataSchema).toStrictEqual({ string: port })
    })

    it('should resolve to an empty object if the initial data schema is a function', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: () => ({}) })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.dataSchema).toStrictEqual({})
    })

    it('should resolve the data schema when calling resolveDataSchema', async() => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineNode({ kind: 'core:example', dataSchema: () => ({ string: port }) })
      using instance = createFlowNodeInstance({ flow, node })
      const result = await instance.resolveDataSchema()
      expect(result).toStrictEqual({ string: port })
      expect(instance.dataSchema).toStrictEqual({ string: port })
    })

    it('should emit the "dataSchema" event when the data schema is resolved', async() => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineNode({ kind: 'core:example', dataSchema: () => ({ string: port }) })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('dataSchema', listener)
      await instance.resolveDataSchema()
      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith({ string: port })
    })
  })

  describe('resolveResultSchema', () => {
    it('should resolve the result schema imedialety if the initial result schema is an object', () => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineNode({ kind: 'core:example', defineResultSchema: { string: port } })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.resultSchema).toStrictEqual({ string: port })
    })

    it('should not have a result schema if the initial result schema is a function', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', defineResultSchema: () => ({}) })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.resultSchema).toBeUndefined()
    })

    it('should resolve the result schema when calling resolveResultSchema', async() => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineNode({ kind: 'core:example', defineResultSchema: () => ({ string: port }) })
      using instance = createFlowNodeInstance({ flow, node })
      const result = await instance.resolveResultSchema()
      expect(result).toStrictEqual({ string: port })
      expect(instance.resultSchema).toStrictEqual({ string: port })
    })

    it('should emit the "resultSchema" event when the result schema is resolved', async() => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineNode({ kind: 'core:example', defineResultSchema: () => ({ string: port }) })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('resultSchema', listener)
      await instance.resolveResultSchema()
      expect(listener).toHaveBeenCalledWith({ string: port })
    })

    it('should not emit the "resultSchema" event when the result schema is already resolved', async() => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineNode({ kind: 'core:example', defineResultSchema: () => ({ string: port }) })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('resultSchema', listener)
      await instance.resolveResultSchema()
      await instance.resolveResultSchema()
      expect(listener).toHaveBeenCalledTimes(1)
    })
  })

  describe('getDataSocket', () => {
    it('should get the port by key from the data schema', () => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineNode({ kind: 'core:example', dataSchema: { string: port } })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.getDataSocket('string')).toStrictEqual(port)
    })

    it('should throw an error if the data schema is not resolved', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: () => ({ string: { name: 'Value', type: typeString } }) })
      using instance = createFlowNodeInstance({ flow, node })
      const shouldThrow = () => instance.getDataSocket('string')
      expect(shouldThrow).toThrow('Data schema not resolved')
    })

    it('should throw an error if the key does not exist in the data schema', () => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineNode({ kind: 'core:example', dataSchema: { string: port } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The key "number" does not exist in the data schema.
      const shouldThrow = () => instance.getDataSocket('number')
      expect(shouldThrow).toThrow(/The data schema of node "[\da-z\-]+" does not contain a port with the key "number"/)
    })
  })

  describe('getResultSocket', () => {
    it('should get the port by key from the result schema', () => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineNode({ kind: 'core:example', defineResultSchema: { string: port } })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.getResultSocket('string')).toStrictEqual(port)
    })

    it('should throw an error if the result schema is not resolved', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', defineResultSchema: () => ({ string: { name: 'Value', type: typeString } }) })
      using instance = createFlowNodeInstance({ flow, node })
      const shouldThrow = () => instance.getResultSocket('string')
      expect(shouldThrow).toThrow('Result schema not resolved')
    })

    it('should throw an error if the key does not exist in the result schema', () => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineNode({ kind: 'core:example', defineResultSchema: { string: port } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The key "number" does not exist in the result schema.
      const shouldThrow = () => instance.getResultSocket('number')
      expect(shouldThrow).toThrow(/The result schema of node "[\da-z\-]+" does not contain a port with the key "number"/)
    })
  })

  describe('setDataValue', () => {
    it('should set the value of a raw data property by key', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      await instance.setDataValue('string', 'Hello, World!')
      expect(instance.dataRaw).toStrictEqual({ string: 'Hello, World!' })
    })

    it('should throw an error if the data schema is not resolved', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: () => ({ string: { name: 'Value', type: typeString } }) })
      using instance = createFlowNodeInstance({ flow, node })
      const shouldReject = async() => await instance.setDataValue('string', 'Hello, World!')
      await expect(shouldReject).rejects.toThrow('Data schema not resolved')
    })

    it('should throw an error if the key does not exist in the data schema', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The key "number" does not exist in the data schema.
      const shouldReject = async() => await instance.setDataValue('number', 42)
      await expect(shouldReject).rejects.toThrow(/The data schema of node "[\da-z\-]+" does not contain a port with the key "number"/)
    })

    it('should not parse the input value based on the type parser of the port', async() => {
      using flow = createFlow()
      const type = defineType({ kind: 'core:number', parse: Number })
      const node = defineNode({ kind: 'core:example', dataSchema: { number: { name: 'Value', type } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The value "42" can be parsed as a number.
      await instance.setDataValue('number', '42')
      expect(instance.data).toStrictEqual({})
    })

    it('should emit the "dataRaw" event when the data is set', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('dataRaw', listener)
      await instance.setDataValue('string', 'Hello, World!')
      expect(listener).toHaveBeenCalledWith({ string: 'Hello, World!' })
    })

    it('should resolve the data schema when the data is set', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('dataSchema', listener)
      await instance.setDataValue('string', 'Hello, World!')
      expect(listener).toHaveBeenCalledWith({ string: { name: 'Value', type: typeString } })
    })

    it('should resolve the result schema when the data is set', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('resultSchema', listener)
      await instance.setDataValue('string', 'Hello, World!')
      expect(listener).toHaveBeenCalledWith({})
    })
  })

  describe('setData', () => {
    it('should set the raw data of the node', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      await instance.setData({ string: 'Hello, World!' })
      expect(instance.dataRaw).toStrictEqual({ string: 'Hello, World!' })
    })

    it('should not parse the input data based on the type parser of the port', async() => {
      using flow = createFlow()
      const type = defineType({ kind: 'core:number', parse: Number })
      const node = defineNode({ kind: 'core:example', dataSchema: { number: { name: 'Value', type } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The value "42" can be parsed as a number.
      await instance.setData({ number: '42' })
      expect(instance.data).toStrictEqual({})
    })

    it('should emit the "dataRaw" event when the data is set', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('dataRaw', listener)
      await instance.setData({ string: 'Hello, World!' })
      expect(listener).toHaveBeenCalledWith({ string: 'Hello, World!' })
    })

    it('should resolve the data schema when the data is set', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('dataSchema', listener)
      await instance.setData({ string: 'Hello, World!' })
      expect(listener).toHaveBeenCalledWith({ string: { name: 'Value', type: typeString } })
    })

    it('should resolve the result schema when the data is set', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('resultSchema', listener)
      await instance.setData({ string: 'Hello, World!' })
      expect(listener).toHaveBeenCalledWith({})
    })

    it('should throw an error if the data schema is not resolved', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: () => ({ string: { name: 'Value', type: typeString } }) })
      using instance = createFlowNodeInstance({ flow, node })
      const shouldReject = async() => await instance.setData({ string: 'Hello, World!' })
      await expect(shouldReject).rejects.toThrow('Data schema not resolved')
    })

    it('should throw an error if a key does not exist in the data schema', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The key "number" does not exist in the data schema.
      const shouldReject = async() => await instance.setData({ number: 42 })
      await expect(shouldReject).rejects.toThrow(/^The data schema of node "[\da-z\-]+" does not contain a port with the key "number"$/)
    })
  })

  describe('setResultValue', () => {
    it('should set the value of a result property by key', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      instance.setResultValue('boolean', true)
      expect(instance.result).toStrictEqual({ boolean: true })
    })

    it('should throw an error if the result schema is not resolved', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', defineResultSchema: () => ({ boolean: { name: 'Value', type: typeBoolean } }) })
      using instance = createFlowNodeInstance({ flow, node })
      const shouldThrow = () => instance.setResultValue('boolean', true)
      expect(shouldThrow).toThrow('Result schema not resolved')
    })

    it('should throw an error if the key does not exist in the result schema', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The key "number" does not exist in the result schema.
      const shouldThrow = () => instance.setResultValue('number', 42)
      expect(shouldThrow).toThrow(/The result schema of node "[\da-z\-]+" does not contain a port with the key "number"/)
    })

    it('should parse the input value based on the type parser of the port', () => {
      using flow = createFlow()
      const type = defineType({ kind: 'core:number', parse: Number })
      const node = defineNode({ kind: 'core:example', defineResultSchema: { number: { name: 'Value', type } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The value "42" can be parsed as a number.
      instance.setResultValue('number', '42')
      expect(instance.result).toStrictEqual({ number: 42 })
    })

    it('should emit the "result" event when the result is set', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('result', listener)
      instance.setResultValue('boolean', true)
      expect(listener).toHaveBeenCalledWith({ boolean: true })
    })

    it('should not emit the "data" event when the result is set', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.setResultValue('boolean', true)
      expect(listener).not.toHaveBeenCalled()
    })

    it('should not refresh the schemas when the result is set', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listenerResultSchema = vi.fn()
      const listenerDataSchema = vi.fn()
      instance.on('resultSchema', listenerResultSchema)
      instance.on('dataSchema', listenerDataSchema)
      instance.setResultValue('boolean', true)
      expect(listenerResultSchema).not.toHaveBeenCalled()
      expect(listenerDataSchema).not.toHaveBeenCalled()
    })
  })

  describe('setResult', () => {
    it('should set the result of the node', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      instance.setResult({ boolean: true })
      expect(instance.result).toStrictEqual({ boolean: true })
    })

    it('should parse the input result based on the type parser of the port', () => {
      using flow = createFlow()
      const type = defineType({ kind: 'core:number', parse: Number })
      const node = defineNode({ kind: 'core:example', defineResultSchema: { number: { name: 'Value', type } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The value "42" can be parsed as a number.
      instance.setResult({ number: '42' })
      expect(instance.result).toStrictEqual({ number: 42 })
    })

    it('should emit the "result" event when the result is set', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('result', listener)
      instance.setResult({ boolean: true })
      expect(listener).toHaveBeenCalledWith({ boolean: true })
    })

    it('should not emit the "data" event when the result is set', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.setResult({ boolean: true })
      expect(listener).not.toHaveBeenCalled()
    })

    it('should throw an error if the result schema is not resolved', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', defineResultSchema: () => ({ boolean: { name: 'Value', type: typeBoolean } }) })
      using instance = createFlowNodeInstance({ flow, node })
      const shouldThrow = () => instance.setResult({ boolean: true })
      expect(shouldThrow).toThrow('Result schema not resolved')
    })

    it('should throw an error if the parser throws an error', () => {
      using flow = createFlow()
      const type = defineType({ kind: 'core:number', parse: () => { throw new Error('Failed to parse') } })
      const node = defineNode({ kind: 'core:example', defineResultSchema: { number: { name: 'Value', type } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: Ignore the type error.
      const shouldThrow = () => instance.setResult({ number: '42' })
      expect(shouldThrow).toThrow('Failed to parse')
    })
  })

  describe('resolveDataValue', () => {
    it('should resolve and parse the value of a raw data property by key', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node, initialData: { string: 'Hello, World!' } })
      const result = instance.resolveDataValue('string')
      expect(result).toBe('Hello, World!')
    })

    it('should resolve and parse value that reference a flow variable', () => {
      using flow = createFlow({ variables: { GREET: 'Hello, World!' } })
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node, initialData: { string: '$VARIABLE.GREET' } })
      const result = instance.resolveDataValue('string')
      expect(result).toBe('Hello, World!')
    })

    it('should resolve and parse value that reference a flow secret', () => {
      using flow = createFlow({ secrets: { GREET: 'Hello, World!' } })
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node, initialData: { string: '$SECRET.GREET' } })
      const result = instance.resolveDataValue('string')
      expect(result).toBe('Hello, World!')
    })

    it('should resolve and parse value that reference a node result port', async() => {
      using flow = createFlow()
      const nodeIn = defineNode({ kind: 'core:example', defineResultSchema: { string: { name: 'Value', type: typeString } } })
      const nodeOut = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instanceIn = flow.createNode(nodeIn, { initialResult: { string: 'Hello, World!' } })
      using instanceOut = flow.createNode(nodeOut, { initialData: { string: `$NODE.${instanceIn.id}:string` } })
      const result = instanceOut.resolveDataValue('string')
      expect(result).toBe('Hello, World!')
    })

    it('should throw an error if the data schema is not resolved', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: () => ({ string: { name: 'Value', type: typeString } }) })
      using instance = createFlowNodeInstance({ flow, node })
      const shouldThrow = () => instance.resolveDataValue('string')
      expect(shouldThrow).toThrow('Data schema not resolved')
    })

    it('should throw an error if the key does not exist in the data schema', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The key "number" does not exist in the data schema.
      const shouldThrow = () => instance.resolveDataValue('number')
      expect(shouldThrow).toThrow(/The data schema of node "[\da-z\-]+" does not contain a port with the key "number"/)
    })
  })

  // FOR REFERENCE:
  // public async process(): Promise<void> {
  //   try {
  //     if (!this.node.process) return

  //     // --- Resolve the data and process the node. If no result is returned,
  //     // --- cancel the operation and await the next data event to process the node again.
  //     await this.resolveData()
  //     const result = await this.node.process(this.context)
  //     if (result === undefined) return

  //     // --- Parse the result based on the result schema and store the result.
  //     const resultSchema = await this.resolveResultSchema()
  //     const resultParse = createSchemaParser(resultSchema)
  //     const resultParsed = resultParse(result)
  //     this.setResult(resultParsed)

  //     // --- Stop the node and resolve the promise.
  //     this.isRunning = false
  //     this.dispatch('end')
  //   }

  //   // --- If an error occurs, dispatch the error event and trigger
  //   // --- the abort signal so pending operations are cancelled.
  //   catch (error) {
  //     this.dispatch('error', error as Error)
  //   }
  // }
  describe('process', () => {
    it('should skip the process if the node does not have a process function', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      await instance.process()
      expect(instance.result).toStrictEqual({})
    })

    it('should resolve the data and process the node', async() => {
      using flow = createFlow()
      const node = defineNode({
        kind: 'core:example',
        dataSchema: { string: { name: 'Value', type: typeString } },
        defineResultSchema: { string: { name: 'Value', type: typeString } },
        process: ({ data }) => ({ string: data.string! }),
      })
      using instance = createFlowNodeInstance({ flow, node, initialData: { string: 'Hello, World!' } })
      await instance.process()
      expect(instance.result).toStrictEqual({ string: 'Hello, World!' })
    })

    it('should throw an error if the result does not match the result schema', async() => {
      using flow = createFlow()
      const node = defineNode({
        kind: 'core:example',
        dataSchema: { string: { name: 'Value', type: typeString } },
        defineResultSchema: { string: { name: 'Value', type: typeString } },
        // @ts-expect-error: The result should be a string.
        process: () => ({ string: 42 }),
      })
      using instance = createFlowNodeInstance({ flow, node, initialData: { string: 'Hello, World!' } })
      const shouldReject = instance.process()
      expect(instance.result).toStrictEqual({})
      await expect(shouldReject).rejects.toThrow('The result does not match the result schema')
    })
  })

  describe('abort', () => {
    it('should trigger the "AbortSignal" when the node is aborted', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const callback = vi.fn()
      instance.context.abortSignal.addEventListener('abort', callback)
      instance.abort()
      expect(callback).toHaveBeenCalledOnce()
    })

    it('should create and assign a new "AbortSignal" when the node is aborted', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const signal = instance.context.abortSignal
      instance.abort()
      expect(instance.context.abortSignal).not.toBe(signal)
    })

    it('should emit the "abort" event when the node is aborted', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example', process: () => {} })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('abort', listener)
      instance.abort()
      await new Promise(nextTick)
      expect(listener).toHaveBeenCalledWith()
    })
  })

  describe('dispose', () => {
    it('should abort the node when disposed', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const abort = vi.fn()
      instance.abort = abort
      instance[Symbol.dispose]()
      expect(abort).toHaveBeenCalledOnce()
    })

    it('should remove all event listeners when disposed', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance[Symbol.dispose]()
      instance.dispatch('data', { string: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })
  })
})
