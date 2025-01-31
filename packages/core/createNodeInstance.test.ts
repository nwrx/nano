/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EXP_UUID } from '@unshared/validation'
import { typeBoolean, typeString } from './__fixtures__'
import { createFlow } from './createFlow'
import { createNodeInstance } from './createNodeInstance'
import { defineNode } from './defineNode'
import { defineType } from './defineType'

describe('createNodeInstance', () => {
  describe('initialize', () => {
    it('should set the flow and the node definition', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      expect(instance.flow).toBe(flow)
      expect(instance.node).toBe(node)
    })

    it('should set the id', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node, id: 'node' })
      expect(instance.id).toBe('node')
    })

    it('should default the id to a random UUID', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      expect(instance.id).toMatch(EXP_UUID)
    })

    it('should pass the initial data if provided', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node, initialData: { string: 'Hello, World!' } })
      expect(instance.data).toStrictEqual({ string: 'Hello, World!' })
    })

    it('should pass the initial result if provided', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node, initialResult: { boolean: false } })
      expect(instance.result).toStrictEqual({ boolean: false })
    })

    it('should clone the initial data', () => {
      using flow = createFlow()
      const initialData = { string: 'Hello, World!' }
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node, initialData })
      expect(instance.data).not.toBe(initialData)
    })

    it('should clone the initial result', () => {
      using flow = createFlow()
      const initialResult = { boolean: false }
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node, initialResult })
      expect(instance.result).not.toBe(initialResult)
    })
  })

  describe('setMeta', () => {
    it('should set the meta property', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      instance.setMeta('key', 'value')
      expect(instance.meta).toStrictEqual({ key: 'value' })
    })

    it('should merge the meta properties', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      instance.setMeta('key', 'value')
      instance.setMeta('key', 'new value')
      expect(instance.meta).toStrictEqual({ key: 'new value' })
    })

    it('should emit the "meta" event', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      const listener = vi.fn()
      instance.on('meta', listener)
      instance.setMeta('key', 'value')
      expect(listener).toHaveBeenCalledWith('key', 'value')
    })
  })

  describe('eventTarget', () => {
    it('should dispatch an event and call the listener', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      const listener = vi.fn()
      instance.on('data', listener)
      // @ts-expect-error: Private method.
      instance.dispatch('data', { string: 'Hello, World!' })
      expect(listener).toHaveBeenCalledWith({ string: 'Hello, World!' })
    })

    it('should remove the listener when destroyed', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.destroy()
      // @ts-expect-error: Private method.
      instance.dispatch('data', { string: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })

    it('should remove the listener when calling the return value of `on`', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      const listener = vi.fn()
      const removeListener = instance.on('data', listener)
      removeListener()
      // @ts-expect-error: Private method.
      instance.dispatch('data', { string: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('resolveDataSchema', () => {
    describe('when dataSchema is an object', () => {
      it('should apply the data schema immediatly', () => {
        using flow = createFlow()
        const port = { name: 'Value', type: typeString }
        const node = defineNode({ kind: 'example', dataSchema: { string: port } })
        using instance = createNodeInstance(flow, { node })
        expect(instance.dataSchema).toStrictEqual({ string: port })
      })
    })

    describe('when dataSchema is a function', () => {
      it('should default to an empty object', () => {
        using flow = createFlow()
        const node = defineNode({ kind: 'example', dataSchema: () => ({}) })
        using instance = createNodeInstance(flow, { node })
        expect(instance.dataSchema).toStrictEqual({})
      })

      it('should resolve the data schema when calling resolveDataSchema', async() => {
        using flow = createFlow()
        const port = { name: 'Value', type: typeString }
        const node = defineNode({ kind: 'example', dataSchema: () => ({ string: port }) })
        using instance = createNodeInstance(flow, { node })
        // @ts-expect-error: Calling a private method.
        const result = await instance.resolveDataSchema()
        expect(result).toStrictEqual({ string: port })
        expect(instance.dataSchema).toStrictEqual({ string: port })
      })

      it('should call the data schema function with the context of the node instance', async() => {
        using flow = createFlow()
        const dataSchema = vi.fn(() => ({}))
        const node = defineNode({ kind: 'example', dataSchema })
        using instance = createNodeInstance(flow, { node })
        // @ts-expect-error: Calling a private method.
        await instance.resolveDataSchema()
        expect(dataSchema).toHaveBeenCalledOnce()
        expect(dataSchema).toHaveBeenCalledWith({
          abortSignal: instance.abortController.signal,
          data: instance.data,
          result: instance.result,
        })
      })

      it('should emit the "dataSchema" event when the data schema is resolved', async() => {
        using flow = createFlow()
        const port = { name: 'Value', type: typeString }
        const node = defineNode({ kind: 'example', dataSchema: () => ({ string: port }) })
        using instance = createNodeInstance(flow, { node })
        const listener = vi.fn()
        instance.on('dataSchema', listener)
        // @ts-expect-error: Calling a private method.
        await instance.resolveDataSchema()
        expect(listener).toHaveBeenCalledOnce()
        expect(listener).toHaveBeenCalledWith({ string: port })
      })
    })
  })

  describe('resolveResultSchema', () => {
    describe('when resultSchema is an object', () => {
      it('should apply the result schema immediatly', () => {
        using flow = createFlow()
        const port = { name: 'Value', type: typeString }
        const node = defineNode({ kind: 'example', resultSchema: { string: port } })
        using instance = createNodeInstance(flow, { node })
        expect(instance.resultSchema).toStrictEqual({ string: port })
      })
    })

    describe('when resultSchema is a function', () => {
      it('should default to an empty object', () => {
        using flow = createFlow()
        const node = defineNode({ kind: 'example', resultSchema: () => ({}) })
        using instance = createNodeInstance(flow, { node })
        expect(instance.resultSchema).toStrictEqual({})
      })

      it('should resolve the result schema when calling resolveResultSchema', async() => {
        using flow = createFlow()
        const port = { name: 'Value', type: typeString }
        const node = defineNode({ kind: 'example', resultSchema: () => ({ string: port }) })
        using instance = createNodeInstance(flow, { node })
        // @ts-expect-error: Calling a private method.
        const result = await instance.resolveResultSchema()
        expect(result).toStrictEqual({ string: port })
        expect(instance.resultSchema).toStrictEqual({ string: port })
      })

      it('should call the result schema function with the context of the node instance', async() => {
        using flow = createFlow()
        const resultSchema = vi.fn(() => ({}))
        const node = defineNode({ kind: 'example', resultSchema })
        using instance = createNodeInstance(flow, { node })
        // @ts-expect-error: Calling a private method.
        await instance.resolveResultSchema()
        expect(resultSchema).toHaveBeenCalledOnce()
        expect(resultSchema).toHaveBeenCalledWith({
          abortSignal: instance.abortController.signal,
          data: instance.data,
          result: instance.result,
        })
      })

      it('should emit the "resultSchema" event when the result schema is resolved', async() => {
        using flow = createFlow()
        const port = { name: 'Value', type: typeString }
        const node = defineNode({ kind: 'example', resultSchema: () => ({ string: port }) })
        using instance = createNodeInstance(flow, { node })
        const listener = vi.fn()
        instance.on('resultSchema', listener)
        // @ts-expect-error: Calling a private method.
        await instance.resolveResultSchema()
        expect(listener).toHaveBeenCalledOnce()
        expect(listener).toHaveBeenCalledWith({ string: port })
      })
    })
  })

  describe('resolveDataValue', () => {
    describe('when the value is provided', () => {
      it('should return the value if it is defined', async() => {
        using flow = createFlow()
        const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString, isOptional: true } } })
        using instance = createNodeInstance(flow, { node, initialData: { string: 'Hello, World!' } })
        // @ts-expect-error: Private method.
        const result = await instance.resolveDataValue('string')
        expect(result).toBe('Hello, World!')
      })

      it('should return the default value if the value is undefined', async() => {
        using flow = createFlow()
        const node = defineNode({
          kind: 'example',
          dataSchema: {
            string: {
              name: 'Value',
              type: typeString,
              isOptional: true,
              defaultValue: 'Default Value',
            },
          },
        })
        using instance = createNodeInstance(flow, { node })
        // @ts-expect-error: Private method.
        const result = await instance.resolveDataValue('string')
        expect(result).toBe('Default Value')
      })

      it('should return the string value', async() => {
        using flow = createFlow()
        const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
        using instance = createNodeInstance(flow, { node, initialData: { string: 'Hello, World!' } })
        // @ts-expect-error: Private method.
        const result = await instance.resolveDataValue('string')
        expect(result).toBe('Hello, World!')
      })

      it('should parse the value using the type parser', async() => {
        using flow = createFlow()
        const type = defineType({ kind: 'core:number', parse: Number })
        const node = defineNode({ kind: 'example', dataSchema: { number: { name: 'Value', type } } })
        // @ts-expect-error: The value "42" can be parsed as a number.
        using instance = createNodeInstance(flow, { node, initialData: { number: '42' } })
        // @ts-expect-error: Private method.
        const result = await instance.resolveDataValue('number')
        expect(result).toBe(42)
      })
    })

    describe('when value is a variable', () => {
      it('should call the resolveVariable method of the flow', async() => {
        const resolveVariable = vi.fn(() => 'Hello, World!')
        using flow = createFlow({ resolveVariable })
        const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
        using instance = createNodeInstance(flow, { node, initialData: { string: '$VARIABLE.GREET' } })
        // @ts-expect-error: Private method.
        await instance.resolveDataValue('string')
        expect(resolveVariable).toHaveBeenCalledOnce()
        expect(resolveVariable).toHaveBeenCalledWith('GREET')
      })

      it('should resolve and parse the variable value', async() => {
        using flow = createFlow({ resolveVariable: name => ({ GREET: 'Hello, World!' }[name]) })
        const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
        using instance = createNodeInstance(flow, { node, initialData: { string: '$VARIABLE.GREET' } })
        // @ts-expect-error: Private method.
        const result = await instance.resolveDataValue('string')
        expect(result).toBe('Hello, World!')
      })

      it('should reject if the variable does not exist', async() => {
        using flow = createFlow({ resolveVariable: () => undefined })
        const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
        using instance = createNodeInstance(flow, { node, initialData: { string: '$VARIABLE.NON_EXISTENT' } })
        // @ts-expect-error: Private method.
        const shouldReject = instance.resolveDataValue('string')
        await expect(shouldReject).rejects.toThrow('Variable "NON_EXISTENT" does not exist or is not accessible')
      })

      it('should dispatch an error if no `resolveVariable` method is provided', async() => {
        using flow = createFlow()
        const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
        using instance = createNodeInstance(flow, { node, initialData: { string: '$VARIABLE.GREET' } })
        // @ts-expect-error: Private method.
        const shouldReject = instance.resolveDataValue('string')
        await expect(shouldReject).rejects.toThrow('Variable "GREET" does not exist or is not accessible')
      })
    })

    describe('when value is a secret', () => {
      it('should call the resolveSecret method of the flow', async() => {
        const resolveSecret = vi.fn(() => 'Hello, World!')
        using flow = createFlow({ resolveSecret })
        const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
        using instance = createNodeInstance(flow, { node, initialData: { string: '$SECRET.GREET' } })
        // @ts-expect-error: Private method.
        await instance.resolveDataValue('string')
        expect(resolveSecret).toHaveBeenCalledOnce()
        expect(resolveSecret).toHaveBeenCalledWith('GREET')
      })

      it('should resolve and parse the secret value', async() => {
        using flow = createFlow({ resolveSecret: name => ({ GREET: 'Hello, World!' }[name]) })
        const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
        using instance = createNodeInstance(flow, { node, initialData: { string: '$SECRET.GREET' } })
        // @ts-expect-error: Private method.
        const result = await instance.resolveDataValue('string')
        expect(result).toBe('Hello, World!')
      })

      it('should dispatch an error if the secret does not exist', async() => {
        using flow = createFlow({ resolveSecret: () => undefined })
        const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
        using instance = createNodeInstance(flow, { node, initialData: { string: '$SECRET.NON_EXISTENT' } })
        // @ts-expect-error: Private method.
        const shouldReject = instance.resolveDataValue('string')
        await expect(shouldReject).rejects.toThrow('Secret "NON_EXISTENT" does not exist or is not accessible')
      })

      it('should dispatch an error if no `resolveSecret` method is provided', async() => {
        using flow = createFlow()
        const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
        using instance = createNodeInstance(flow, { node, initialData: { string: '$SECRET.GREET' } })
        // @ts-expect-error: Private method.
        const shouldReject = instance.resolveDataValue('string')
        await expect(shouldReject).rejects.toThrow('Secret "GREET" does not exist or is not accessible')
      })
    })

    describe('when value is a node reference', () => {
      it('should resolve and parse value from the source node', async() => {
        using flow = createFlow()
        const nodeIn = defineNode({ kind: 'example', resultSchema: { string: { name: 'Value', type: typeString } } })
        const nodeOut = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
        using instanceIn = flow.add(nodeIn, { initialResult: { string: 'Hello, World!' } })
        using instanceOut = flow.add(nodeOut, { initialData: { string: `$NODE.${instanceIn.id}:string` } })
        // @ts-expect-error: Private method.
        const result = await instanceOut.resolveDataValue('string')
        expect(result).toBe('Hello, World!')
      })

      it('should reject if a referenced node does not exist', async() => {
        using flow = createFlow()
        const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
        using instance = flow.add(node, { initialData: { string: '$NODE.NON_EXISTENT:string' } })
        // @ts-expect-error: Private method.
        const shouldReject = instance.resolveDataValue('string')
        await expect(shouldReject).rejects.toThrow('The node with ID "NON_EXISTENT" does not exist')
      })
    })
  })

  describe('resolveData', () => {
    it('should resolve the data schema and parse the data', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createNodeInstance(flow, { node, initialData: { string: 'Hello, World!' } })
      // @ts-expect-error: Private method.
      await instance.resolveData()
      expect(instance.data).toStrictEqual({ string: 'Hello, World!' })
    })

    it('should not resolve the data if the data schema is not resolved', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example', dataSchema: () => ({ string: { name: 'Value', type: typeString } }) })
      using instance = createNodeInstance(flow, { node, initialData: { string: 'Hello, World!' } })
      // @ts-expect-error: Private method.
      const data = await instance.resolveData()
      expect(data).toBeUndefined()
    })
  })

  describe('setDataValue', () => {
    it('should set the value of a raw data property by key', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createNodeInstance(flow, { node })
      instance.setDataValue('string', 'Hello, World!')
      expect(instance.data).toStrictEqual({ string: 'Hello, World!' })
    })

    it('should emit the "data" event when the data is set', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example', dataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createNodeInstance(flow, { node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.setDataValue('string', 'Hello, World!')
      expect(listener).toHaveBeenCalledWith({ string: 'Hello, World!' })
    })
  })

  describe('setResult', () => {
    it('should set the result of the node', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example', resultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createNodeInstance(flow, { node })
      instance.setResult({ boolean: true })
      expect(instance.result).toStrictEqual({ boolean: true })
    })

    it('should parse the input result based on the type parser of the port', () => {
      using flow = createFlow()
      const type = defineType({ kind: 'core:number', parse: Number })
      const node = defineNode({ kind: 'example', resultSchema: { number: { name: 'Value', type } } })
      using instance = createNodeInstance(flow, { node })
      // @ts-expect-error: The value "42" can be parsed as a number.
      instance.setResult({ number: '42' })
      expect(instance.result).toStrictEqual({ number: 42 })
    })

    it('should emit the "result" event when the result is set', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example', resultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createNodeInstance(flow, { node })
      const listener = vi.fn()
      instance.on('result', listener)
      instance.setResult({ boolean: true })
      expect(listener).toHaveBeenCalledWith({ boolean: true })
    })

    it('should not emit the "data" event when the result is set', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example', resultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createNodeInstance(flow, { node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.setResult({ boolean: true })
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('start', () => {
    const node = defineNode({
      kind: 'example',
      dataSchema: { input: { name: 'Input', type: typeString } },
      resultSchema: { output: { name: 'Output', type: typeString } },
      process: ({ data }) => ({ output: data.input }),
    })

    it('should resolve data schema and result schema before processing', async() => {
      using flow = createFlow()
      using instance = createNodeInstance(flow, { node })
      const resolveDataSchemaSpy = vi.spyOn(instance as any, 'resolveDataSchema')
      const resolveResultSchemaSpy = vi.spyOn(instance as any, 'resolveResultSchema')
      await instance.start()
      expect(resolveDataSchemaSpy).toHaveBeenCalledOnce()
      expect(resolveResultSchemaSpy).toHaveBeenCalledOnce()
    })

    it('should resolve data correctly before processing', async() => {
      using flow = createFlow()
      using instance = createNodeInstance(flow, { node, initialData: { input: 'Hello' } })
      const resolveDataSpy = vi.spyOn(instance as any, 'resolveData')
      await instance.start()
      expect(resolveDataSpy).toHaveBeenCalledOnce()
      expect(instance.dataResolved).toStrictEqual({ input: 'Hello' })
    })

    it('should call the process function with the correct context', async() => {
      using flow = createFlow()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const processSpy = vi.fn(({ data }) => ({ output: data.input }))
      const node = defineNode({
        kind: 'example',
        dataSchema: { input: { name: 'Input', type: typeString } },
        resultSchema: { output: { name: 'Output', type: typeString } },
        process: processSpy,
      })
      using instance = createNodeInstance(flow, { node, initialData: { input: 'Hello' } })
      await instance.start()
      expect(processSpy).toHaveBeenCalledOnce()
      expect(processSpy).toHaveBeenCalledWith({
        data: { input: 'Hello' },
        result: {},
        abortSignal: instance.abortController.signal,
      })
    })

    it('should set the result correctly after processing', async() => {
      using flow = createFlow()
      using instance = createNodeInstance(flow, { node, initialData: { input: 'Hello' } })
      await instance.start()
      expect(instance.result).toStrictEqual({ output: 'Hello' })
    })

    it('should emit the "start" event before processing', async() => {
      using flow = createFlow()
      using instance = createNodeInstance(flow, { node, initialData: { input: 'Hello' } })
      const listener = vi.fn()
      instance.on('start', listener)
      await instance.start()
      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith({ input: 'Hello' }, expect.objectContaining({
        executionId: expect.stringMatching(EXP_UUID),
        threadId: expect.stringMatching(EXP_UUID),
        delta: expect.any(Number),
        duration: expect.any(Number),
        timestamp: expect.any(Number),
      }))
    })

    it('should emit the "end" event after processing', async() => {
      using flow = createFlow()
      using instance = createNodeInstance(flow, { node, initialData: { input: 'Hello' } })
      const listener = vi.fn()
      instance.on('end', listener)
      await instance.start()
      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith(
        { input: 'Hello' },
        { output: 'Hello' },
        expect.objectContaining({
          executionId: expect.stringMatching(EXP_UUID),
          threadId: expect.stringMatching(EXP_UUID),
          delta: expect.any(Number),
          duration: expect.any(Number),
          timestamp: expect.any(Number),
        }),
      )
    })

    it('should handle errors during processing and dispatch the "error" event', async() => {
      using flow = createFlow()
      const errorNode = defineNode({
        kind: 'example',
        dataSchema: { input: { name: 'Input', type: typeString } },
        resultSchema: { output: { name: 'Output', type: typeString } },
        process: () => { throw new Error('Processing error') },
      })
      using instance = createNodeInstance(flow, { node: errorNode, initialData: { input: 'Hello' } })
      const listener = vi.fn()
      instance.on('error', listener)
      await instance.start()
      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith(
        new Error('Processing error'),
        expect.objectContaining({
          executionId: expect.stringMatching(EXP_UUID),
          threadId: expect.stringMatching(EXP_UUID),
          delta: expect.any(Number),
          duration: expect.any(Number),
          timestamp: expect.any(Number),
        }),
      )
    })

    it('should update the node state correctly during and after processing', async() => {
      using flow = createFlow()
      using instance = createNodeInstance(flow, { node, initialData: { input: 'Hello' } })
      const startPromise = instance.start()
      expect(instance.isRunning).toBe(true)
      await startPromise
      expect(instance.isRunning).toBe(false)
      expect(instance.isDone).toBe(true)
    })

    it('should dispatch an error if the node is already running', async() => {
      using flow = createFlow()
      using instance = createNodeInstance(flow, { node, initialData: { input: 'Hello' } })
      instance.isRunning = true
      const listener = vi.fn()
      instance.on('error', listener)
      await instance.start()
      expect(listener).toHaveBeenCalledOnce()
    })

    it('should not start the node if it is destroyed', async() => {
      using flow = createFlow()
      using instance = createNodeInstance(flow, { node, initialData: { input: 'Hello' } })
      instance.isDestroyed = true
      const listener = vi.fn()
      instance.on('error', listener)
      await instance.start()
      expect(listener).toHaveBeenCalledOnce()
    })
  })

  describe('abort', () => {
    it('should trigger the "AbortSignal" when the node is aborted', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      const callback = vi.fn()
      // @ts-expect-error: Private property.
      instance.context.abortSignal.addEventListener('abort', callback)
      instance.abort()
      expect(callback).toHaveBeenCalledOnce()
    })

    it('should create and assign a new "AbortSignal" when the node is aborted', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      // @ts-expect-error: Private property.
      const signal = instance.context.abortSignal
      instance.abort()
      // @ts-expect-error: Private property.
      expect(instance.context.abortSignal).not.toBe(signal)
    })

    it('should emit the "abort" event when the node is aborted', async() => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      const listener = vi.fn()
      instance.on('abort', listener)
      instance.abort()
      await new Promise(resolve => process.nextTick(resolve))
      expect(listener).toHaveBeenCalledWith({
        delta: expect.any(Number),
        duration: expect.any(Number),
        timestamp: expect.any(Number),
        executionId: instance.executionId,
        threadId: flow.threadId,
      })
    })
  })

  describe('destroy', () => {
    it('should abort the node when destroyed', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      const abort = vi.fn()
      instance.abort = abort
      instance.destroy()
      expect(abort).toHaveBeenCalled()
    })

    it('should remove all event listeners when destroyed', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.destroy()
      // @ts-expect-error: Private method.
      instance.dispatch('data', { string: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('should abort the node when disposed', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      const abort = vi.fn()
      instance.abort = abort
      instance[Symbol.dispose]()
      expect(abort).toHaveBeenCalledOnce()
    })

    it('should remove all event listeners when disposed', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance[Symbol.dispose]()
      instance.dispatch('data', { string: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })
  })
})
