/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EXP_UUID } from '@unshared/validation'
import { typeString } from './__fixtures__'
import { createFlow } from './createFlow'
import { createNodeInstance, NodeInstance } from './createNodeInstance'
import { defineNode } from './defineNode'

describe('createNodeInstance', () => {
  describe('initialize', () => {
    it('should create a new NodeInstance', () => {
      using instance = createNodeInstance({ kind: 'example' })
      expect(instance).toBeInstanceOf(NodeInstance)
    })

    it('should default the id to a random UUID', () => {
      using instance = createNodeInstance({ kind: 'example' })
      expect(instance.id).toMatch(EXP_UUID)
    })

    it('should set the id', () => {
      using instance = createNodeInstance({ kind: 'example' }, { id: 'unique-id' })
      expect(instance.id).toBe('unique-id')
    })

    it('should pass the initial data if provided', () => {
      using instance = createNodeInstance({ kind: 'example' }, { initialData: { value: 'Hello, World!' } })
      expect(instance.data).toStrictEqual({ value: 'Hello, World!' })
    })

    it('should pass the initial result if provided', () => {
      using instance = createNodeInstance({ kind: 'example' }, { initialResult: { boolean: false } })
      expect(instance.result).toStrictEqual({ boolean: false })
    })

    it('should clone the initial data', () => {
      const initialData = { value: 'Hello, World!' }
      using instance = createNodeInstance({ kind: 'example' }, { initialData })
      expect(instance.data).not.toBe(initialData)
    })

    it('should clone the initial result', async() => {
      const initialResult = { boolean: false }
      using instance = createNodeInstance({ kind: 'example' }, { initialResult })
      expect(instance.result).not.toBe(initialResult)
    })

    it('should store the node definition', async() => {
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(node)
      expect(instance.node).toBe(node)
    })

    it('should bind the flow to the instance', async() => {
      using flow = createFlow()
      using instance = createNodeInstance({ kind: 'example' }, { flow })
      expect(instance.flow).toBe(flow)
    })
  })

  describe('setMeta', async() => {
    it('should set the meta property', async() => {
      using instance = createNodeInstance({ kind: 'example' })
      instance.setMeta('key', 'value')
      expect(instance.meta).toStrictEqual({ key: 'value' })
    })

    it('should merge the meta properties', async() => {
      using instance = createNodeInstance({ kind: 'example' })
      instance.setMeta('key', 'value')
      instance.setMeta('key', 'new value')
      expect(instance.meta).toStrictEqual({ key: 'new value' })
    })

    it('should emit the "meta" event', async() => {
      using instance = createNodeInstance({ kind: 'example' })
      const listener = vi.fn()
      instance.on('meta', listener)
      instance.setMeta('key', 'value')
      expect(listener).toHaveBeenCalledWith('key', 'value', {
        state: 'IDLE',
        delta: expect.any(Number),
        duration: expect.any(Number),
        executionId: expect.stringMatching(EXP_UUID),
        threadId: undefined,
        timestamp: expect.any(Number),
      })
    })
  })

  describe('eventTarget', async() => {
    it('should dispatch an event and call the listener', async() => {
      using instance = createNodeInstance({ kind: 'example' })
      const listener = vi.fn()
      instance.on('data', listener)
      // @ts-expect-error: Private method.
      instance.dispatch('data', 'Hello', 'World')
      expect(listener).toHaveBeenCalledWith('Hello', 'World')
    })

    it('should remove the listener when destroyed', async() => {
      using instance = createNodeInstance({ kind: 'example' })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.destroy()
      // @ts-expect-error: Private method.
      instance.dispatch('data', 'Hello, World!')
      expect(listener).not.toHaveBeenCalled()
    })

    it('should remove the listener when calling the return value of `on`', async() => {
      using instance = createNodeInstance({ kind: 'example' })
      const listener = vi.fn()
      const removeListener = instance.on('data', listener)
      removeListener()
      // @ts-expect-error: Private method.
      instance.dispatch('data', 'Hello, World!')
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('setDataValue', async() => {
    it('should set the value of a raw data property by key', async() => {
      const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
      using instance = createNodeInstance(node)
      instance.setDataValue('value', 'Hello, World!')
      expect(instance.data).toStrictEqual({ value: 'Hello, World!' })
    })

    it('should emit the "data" event when the data is set', async() => {
      const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
      using instance = createNodeInstance(node)
      const listener = vi.fn()
      instance.on('data', listener)
      instance.setDataValue('value', 'Hello, World!')
      expect(listener).toHaveBeenCalledWith({ value: 'Hello, World!' }, {
        state: 'IDLE',
        delta: expect.any(Number),
        duration: expect.any(Number),
        executionId: expect.stringMatching(EXP_UUID),
        threadId: undefined,
        timestamp: expect.any(Number),
      })
    })
  })

  describe('refresh', async() => {
    describe('resolveDataSchema', async() => {
      describe('when dataSchema is an object', async() => {
        it('should apply the dataSchema immediatly from the node definition', async() => {
          const dataSchema = { value: { type: typeString } }
          using instance = createNodeInstance({ kind: 'example', dataSchema })
          expect(instance.dataSchema).toStrictEqual(dataSchema)
        })

        it('should clone the dataSchema', async() => {
          const dataSchema = { value: { type: typeString } }
          using instance = createNodeInstance({ kind: 'example', dataSchema })
          expect(instance.dataSchema).not.toBe(dataSchema)
        })
      })

      describe('when dataSchema is a function', async() => {
        it('should default dataSchema to an empty object', async() => {
          using instance = createNodeInstance({ kind: 'example', dataSchema: () => ({}) })
          expect(instance.dataSchema).toStrictEqual({})
        })

        it('should resolve dataSchema when calling resolveDataSchema', async() => {
          const dataSchema = { value: { type: typeString } }
          using instance = createNodeInstance({ kind: 'example', dataSchema: () => dataSchema })
          await instance.refresh()
          expect(instance.dataSchema).toStrictEqual(dataSchema)
        })

        it('should call the node\'s "dataSchema" function with the context of the node instance', async() => {
          const dataSchema = vi.fn(() => ({}))
          using instance = createNodeInstance({ kind: 'example', dataSchema })
          await instance.refresh()
          expect(dataSchema).toHaveBeenCalledOnce()
          expect(dataSchema).toHaveBeenCalledWith({
            // @ts-expect-error: Private property.
            abortSignal: instance.abortController.signal,
            data: instance.data,
            result: instance.result,
          })
        })

        it('should emit the "dataSchema" event when the data schema is resolved', async() => {
          const dataSchema = { value: { type: typeString } }
          using instance = createNodeInstance({ kind: 'example', dataSchema: () => dataSchema })
          const listener = vi.fn()
          instance.on('dataSchema', listener)
          await instance.refresh()
          expect(listener).toHaveBeenCalledOnce()
          expect(listener).toHaveBeenCalledWith(dataSchema, {
            state: 'IDLE',
            delta: expect.any(Number),
            duration: expect.any(Number),
            executionId: expect.stringMatching(EXP_UUID),
            threadId: undefined,
            timestamp: expect.any(Number),
          })
        })
      })
    })

    describe('resolveResultSchema', async() => {
      describe('when resultSchema is an object', async() => {
        it('should apply the resultSchema immediatly from the node definition', async() => {
          const resultSchema = { value: { type: typeString } }
          using instance = createNodeInstance({ kind: 'example', resultSchema })
          expect(instance.resultSchema).toStrictEqual(resultSchema)
        })

        it('should clone the resultSchema', async() => {
          const resultSchema = { value: { type: typeString } }
          using instance = createNodeInstance({ kind: 'example', resultSchema })
          expect(instance.resultSchema).not.toBe(resultSchema)
        })
      })

      describe('when resultSchema is a function', async() => {
        it('should default resultSchema to an empty object', async() => {
          using instance = createNodeInstance({ kind: 'example', resultSchema: () => ({}) })
          expect(instance.resultSchema).toStrictEqual({})
        })

        it('should resolve resultSchema when calling resolveResultSchema', async() => {
          const resultSchema = { value: { type: typeString } }
          using instance = createNodeInstance({ kind: 'example', resultSchema: () => resultSchema })
          await instance.refresh()
          expect(instance.resultSchema).toStrictEqual(resultSchema)
        })

        it('should call the node\'s "resultSchema" function with the context of the node instance', async() => {
          const resultSchema = vi.fn(() => ({}))
          using instance = createNodeInstance({ kind: 'example', resultSchema })
          await instance.refresh()
          expect(resultSchema).toHaveBeenCalledOnce()
          expect(resultSchema).toHaveBeenCalledWith({
            // @ts-expect-error: Private property.
            abortSignal: instance.abortController.signal,
            data: instance.data,
            result: instance.result,
          })
        })

        it('should emit the "resultSchema" event when the result schema is resolved', async() => {
          const resultSchema = { value: { type: typeString } }
          using instance = createNodeInstance({ kind: 'example', resultSchema: () => resultSchema })
          const listener = vi.fn()
          instance.on('resultSchema', listener)
          await instance.refresh()
          expect(listener).toHaveBeenCalledOnce()
          expect(listener).toHaveBeenCalledWith(resultSchema, {
            state: 'IDLE',
            delta: expect.any(Number),
            duration: expect.any(Number),
            executionId: expect.stringMatching(EXP_UUID),
            threadId: undefined,
            timestamp: expect.any(Number),
          })
        })
      })
    })

    describe('resolveData', async() => {
      describe('when key is not present in the data schema', async() => {
        it('should omit properties that are not defined in the data schema', async() => {
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(node, { initialData: { value: 'Hello, World!', number: 42 } })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: 'Hello, World!' })
        })

        it('should resolve dataSchema before resolving data', async() => {
          const node = defineNode({ kind: 'example', dataSchema: () => ({ value: { type: typeString } }) })
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(node, { initialData: { value: 'Hello, World!', number: 42 } })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: 'Hello, World!' })
        })

        it('should flag the node as ready even if additional properties are present', async() => {
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(node, { initialData: { value: 'Hello, World!', number: 42 } })
          const isReady = await instance.refresh()
          expect(isReady).toBe(true)
        })
      })

      describe('when value is undefined', () => {
        it('should return undefined if no default value is provided', async() => {
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(node)
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: undefined })
        })

        it('should return the default value if provided', async() => {
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString, defaultValue: 'Hello, World!' } } })
          using instance = createNodeInstance(node)
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: 'Hello, World!' })
        })

        it('should flag the node as ready if the socket is optional', async() => {
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString, isOptional: true } } })
          using instance = createNodeInstance(node)
          const isReady = await instance.refresh()
          expect(isReady).toBe(true)
        })

        it('should flag the node as not ready if the socket is required', async() => {
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString, isOptional: false } } })
          using instance = createNodeInstance(node)
          const isReady = await instance.refresh()
          expect(isReady).toBe(false)
        })
      })

        const nodeOk = defineNode({
          kind: 'example',
          dataSchema: {
            value: {
              type: {
                kind: 'string',
                parse: vi.fn(String),
              },
            },
          },
        })

        const nodeError = defineNode({
          kind: 'example',
          dataSchema: {
            value: {
              type: {
                kind: 'string',
                parse: () => { throw new Error('Parsing error') },
              },
            },
          },
        })

        it('should parse and return the value using the type\'s parser', async() => {
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(nodeOk, { initialData: { value: 42 } })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: '42' })
          expect(nodeOk.dataSchema.value.type.parse).toHaveBeenCalledOnce()
          expect(nodeOk.dataSchema.value.type.parse).toHaveBeenCalledWith(42)
        })

        it('should flag the node as ready if the value was correctly parsed', async() => {
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(nodeOk, { initialData: { value: 42 } })
          const isReady = await instance.refresh()
          expect(isReady).toBe(true)
        })

        it('should collect the errors if the value cannot be parsed', async() => {
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(nodeError, { initialData: { value: 42 } })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({})
          expect(instance.dataParseErrors).toStrictEqual({ value: new Error('Parsing error') })
        })

        it('should dispatch a "dataParseError" event if the value cannot be parsed', async() => {
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(nodeError, { initialData: { value: 42 } })
          const listener = vi.fn()
          instance.on('dataParseError', listener)
          await instance.refresh()
          const error = new Error('Parsing error')
          expect(listener).toHaveBeenCalledOnce()
          expect(listener).toHaveBeenCalledWith('value', error, {
            state: 'IDLE',
            delta: expect.any(Number),
            duration: expect.any(Number),
            executionId: expect.stringMatching(EXP_UUID),
            threadId: undefined,
            timestamp: expect.any(Number),
          })
        })

        it('should flag the node as not ready if a parsing error occurs', async() => {
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(nodeError, { initialData: { value: 42 } })
          const isReady = await instance.refresh()
          expect(isReady).toBe(false)
        })
      })

      describe('when value is a reference', () => {
        it('should resolve the reference', async() => {
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(node, { initialData: { value: '$VARIABLE.GREET' }, resolveReference: (type, name) => `Hello, world! (${type}:${name})` })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: 'Hello, world! (VARIABLE:GREET)' })
        })

        it('should parse the resolved value using the type\'s parser', async() => {
          const type = { kind: 'string', parse: vi.fn(String) }
          const node = defineNode({ kind: 'example', dataSchema: { value: { type } } })
          using instance = createNodeInstance(node, { initialData: { value: '$VARIABLE.GREET' }, resolveReference: () => 42 })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: '42' })
        })

        it('should call the resolveReference method with the correct arguments', async() => {
          const resolveReference = vi.fn()
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(node, { initialData: { value: '$VARIABLE.GREET' }, resolveReference })
          await instance.refresh()
          expect(resolveReference).toHaveBeenCalledOnce()
          expect(resolveReference).toHaveBeenCalledWith('VARIABLE', 'GREET')
        })

        it('should collect the errors if the resolveReference method throws an error', async() => {
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          const resolveReference = () => { throw new Error('Reference error') }
          using instance = createNodeInstance(node, { initialData: { value: '$VARIABLE.GREET' }, resolveReference })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({})
          expect(instance.dataParseErrors).toStrictEqual({ value: new Error('Reference error') })
        })

        it('should dispatch a "dataParseError" event if the resolveReference method throws an error', async() => {
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          const resolveReference = () => { throw new Error('Reference error') }
          using instance = createNodeInstance(node, { initialData: { value: '$VARIABLE.GREET' }, resolveReference })
          const listener = vi.fn()
          instance.on('dataParseError', listener)
          await instance.refresh()
          const error = new Error('Reference error')
          expect(listener).toHaveBeenCalledOnce()
          expect(listener).toHaveBeenCalledWith('value', error, {
            state: 'IDLE',
            delta: expect.any(Number),
            duration: expect.any(Number),
            executionId: expect.stringMatching(EXP_UUID),
            threadId: undefined,
            timestamp: expect.any(Number),
          })
        })

        it('should flag the node as ready if the resolver method returns a value', async() => {
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(node, { initialData: { value: '$VARIABLE.GREET' }, resolveReference: () => 'Hello, world!' })
          const isReady = await instance.refresh()
          expect(isReady).toBe(true)
        })

        it('should flag the node as not ready if the variable does not exist', async() => {
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(node, { initialData: { value: '$VARIABLE.GREET' }, resolveReference: () => undefined })
          const isReady = await instance.refresh()
          expect(isReady).toBe(false)
        })
      })
    })
  })

  describe('start', () => {
    const node = defineNode({
      kind: 'example',
      dataSchema: { input: { name: 'Input', type: typeString } },
      resultSchema: { output: { name: 'Output', type: typeString } },
      process: vi.fn(({ data }) => ({ output: data.input })),
    })

    describe('lifecycle', () => {
      it('should resolve data correctly before processing', async() => {
        using instance = createNodeInstance(node, { initialData: { input: 'Hello' } })
        const resolveDataSpy = vi.spyOn(instance as any, 'resolveData')
        const resolveDataSchemaSpy = vi.spyOn(instance as any, 'resolveDataSchema')
        const resolveResultSchemaSpy = vi.spyOn(instance as any, 'resolveResultSchema')
        await instance.start()
        expect(instance.dataResolved).toStrictEqual({ input: 'Hello' })
        expect(resolveDataSpy).toHaveBeenCalledOnce()
        expect(resolveDataSchemaSpy).toHaveBeenCalledOnce()
        expect(resolveResultSchemaSpy).toHaveBeenCalledOnce()
      })

      it('should skip processing if the node is not ready', async() => {
        const node = defineNode({ kind: 'example', dataSchema: { input: { type: typeString } } })
        using instance = createNodeInstance(node)
        const listener = vi.fn()
        instance.on('start', listener)
        await instance.start()
        expect(listener).not.toHaveBeenCalled()
      })

      it('should call the process function with the correct context', async() => {
        using instance = createNodeInstance(node, { initialData: { input: 'Hello' } })
        await instance.start()
        expect(node.process).toHaveBeenCalledOnce()
        expect(node.process).toHaveBeenCalledWith({
          data: { input: 'Hello' },
          result: {},
          // @ts-expect-error: Private property.
          abortSignal: instance.abortController.signal,
        })
      })

      it('should set the result correctly after processing', async() => {
        using instance = createNodeInstance(node, { initialData: { input: 'Hello' } })
        await instance.start()
        expect(instance.result).toStrictEqual({ output: 'Hello' })
      })
    })

    describe('concurency', () => {
      const node = defineNode({
        kind: 'example',
        process: async() => {
          await new Promise(resolve => setTimeout(resolve, 1))
          return {}
        },
      })

      it('should throw an error if the node is already running', async() => {
        using instance = createNodeInstance(node)
        // @ts-expect-error: Private property.
        instance.state = 'RUNNING'
        const shouldReject = instance.start()
        await expect(shouldReject).rejects.toThrowError('Node is already running')
      })

      it('should throw an error if the node is already processing', async() => {
        using instance = createNodeInstance(node)
        // @ts-expect-error: Private property.
        instance.state = 'RUNNING/PROCESSING'
        const shouldReject = instance.start()
        await expect(shouldReject).rejects.toThrowError('Node is already processing')
      })

      it('should throw an error if the node is already destroyed', async() => {
        using instance = createNodeInstance(node)
        instance.destroy()
        const shouldReject = instance.start()
        await expect(shouldReject).rejects.toThrowError('Node has been destroyed')
      })
    })

    describe('events', () => {
      it('should dispatch the "start" event before processing', async() => {
        using instance = createNodeInstance(node, { initialData: { input: 'Hello' } })
        const listener = vi.fn()
        instance.on('start', listener)
        await instance.start()
        expect(listener).toHaveBeenCalledOnce()
        expect(listener).toHaveBeenCalledWith({ input: 'Hello' }, {
          state: 'RUNNING',
          executionId: expect.stringMatching(EXP_UUID),
          threadId: undefined,
          delta: expect.any(Number),
          duration: expect.any(Number),
          timestamp: expect.any(Number),
        })
      })

      it('should dispatch the "end" event after processing', async() => {
        using instance = createNodeInstance(node, { initialData: { input: 'Hello' } })
        const listener = vi.fn()
        instance.on('end', listener)
        await instance.start()
        expect(listener).toHaveBeenCalledOnce()
        expect(listener).toHaveBeenCalledWith(
          { input: 'Hello' },
          { output: 'Hello' },
          {
            state: 'PROCESSING',
            executionId: expect.stringMatching(EXP_UUID),
            threadId: undefined,
            delta: expect.any(Number),
            duration: expect.any(Number),
            timestamp: expect.any(Number),
          },
        )
      })

      it('should dispatch the "error" event if an error occurs', async() => {
        const error = new Error('Processing error')
        const node = defineNode({
          kind: 'example',
          dataSchema: { input: { name: 'Input', type: typeString } },
          resultSchema: { output: { name: 'Output', type: typeString } },
          process: () => { throw error },
        })
        using instance = createNodeInstance(node, { initialData: { input: 'Hello' } })
        const listener = vi.fn()
        instance.on('error', listener)
        await instance.start()
        expect(listener).toHaveBeenCalledOnce()
        expect(listener).toHaveBeenCalledWith(error, {
          state: 'PROCESSING',
          executionId: expect.stringMatching(EXP_UUID),
          threadId: undefined,
          delta: expect.any(Number),
          duration: expect.any(Number),
          timestamp: expect.any(Number),
        })
      })
    })

    describe('state', () => {
      it('should be "IDLE" before processing', async() => {
        using instance = createNodeInstance(node)
        expect(instance.state).toBe('IDLE')
      })

      it('should be "RUNNING" when starting but not yet processing', async() => {
        const node = defineNode({
          kind: 'example',
          dataSchema: async() => {
            await new Promise(resolve => setTimeout(resolve, 1))
            return { input: { type: typeString } }
          },
        })
        using instance = createNodeInstance(node, { initialData: { input: 'Hello' } })
        const promise = instance.start()
        expect(instance.state).toBe('RUNNING')
        await promise
      })

      it('should be "PROCESSING" when calling the process function', async() => {
        const node = defineNode({
          kind: 'example',
          process: async() => {
            await new Promise(resolve => setTimeout(resolve, 1))
            return {}
          },
        })
        using instance = createNodeInstance(node)
        const promise = instance.start()
        await new Promise(resolve => setTimeout(resolve, 1))
        expect(instance.state).toBe('PROCESSING')
        await promise
      })

      it('should be "DONE" after processing', async() => {
        using instance = createNodeInstance(node, { initialData: { input: 'Hello' } })
        await instance.start()
        expect(instance.state).toBe('DONE')
      })

      it('should be "DESTROYED" after processing if the node is destroyed', () => {
        using instance = createNodeInstance(node, { initialData: { input: 'Hello' } })
        instance.destroy()
        expect(instance.state).toBe('DESTROYED')
      })
    })
  })

  describe('abort', () => {
    it('should trigger the "AbortSignal" when the node is aborted', () => {
      using instance = createNodeInstance({ kind: 'example' })
      const callback = vi.fn()
      // @ts-expect-error: Private property.
      instance.context.abortSignal.addEventListener('abort', callback)
      instance.abort()
      expect(callback).toHaveBeenCalledOnce()
    })

    it('should create and assign a new "AbortSignal" when the node is aborted', () => {
      using instance = createNodeInstance({ kind: 'example' })
      // @ts-expect-error: Private property.
      const signal = instance.context.abortSignal
      instance.abort()
      // @ts-expect-error: Private property.
      expect(instance.context.abortSignal).not.toBe(signal)
    })

    it('should emit the "abort" event when the node is aborted', () => {
      using instance = createNodeInstance({ kind: 'example' })
      const listener = vi.fn()
      instance.on('abort', listener)
      instance.abort()
      await new Promise(resolve => process.nextTick(resolve))
      expect(listener).toHaveBeenCalledWith({
        state: 'IDLE',
        delta: expect.any(Number),
        duration: expect.any(Number),
        timestamp: expect.any(Number),
        executionId: expect.stringMatching(EXP_UUID),
        threadId: undefined,
      })
    })
  })

  describe('destroy', () => {
    it('should abort the node when destroyed', () => {
      using instance = createNodeInstance({ kind: 'example' })
      const abort = vi.fn()
      instance.abort = abort
      instance.destroy()
      expect(abort).toHaveBeenCalled()
    })

    it('should remove all event listeners when destroyed', () => {
      using instance = createNodeInstance({ kind: 'example' })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.destroy()
      // @ts-expect-error: Private method.
      instance.dispatch('data', { value: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })

    it('should abort the node when disposed', () => {
      using instance = createNodeInstance({ kind: 'example' })
      const abort = vi.fn()
      instance.abort = abort
      instance[Symbol.dispose]()
      expect(abort).toHaveBeenCalledOnce()
    })

    it('should remove all event listeners when disposed', () => {
      using instance = createNodeInstance({ kind: 'example' })
      const listener = vi.fn()
      instance.on('data', listener)
      instance[Symbol.dispose]()
      // @ts-expect-error: Private method.
      instance.dispatch('data', { value: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })
  })
})
