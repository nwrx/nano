/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EXP_UUID } from '@unshared/validation'
import { typeString } from './__fixtures__'
import { createFlow } from './createFlow'
import { createNodeInstance } from './createNodeInstance'
import { defineNode } from './defineNode'

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
      using instance = createNodeInstance(flow, { node, initialData: { value: 'Hello, World!' } })
      expect(instance.data).toStrictEqual({ value: 'Hello, World!' })
    })

    it('should pass the initial result if provided', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node, initialResult: { boolean: false } })
      expect(instance.result).toStrictEqual({ boolean: false })
    })

    it('should clone the initial data', () => {
      using flow = createFlow()
      const initialData = { value: 'Hello, World!' }
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
      instance.dispatch('data', { value: 'Hello, World!' })
      expect(listener).toHaveBeenCalledWith({ value: 'Hello, World!' })
    })

    it('should remove the listener when destroyed', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example' })
      using instance = createNodeInstance(flow, { node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.destroy()
      // @ts-expect-error: Private method.
      instance.dispatch('data', { value: 'Hello, World!' })
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
      instance.dispatch('data', { value: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('setDataValue', () => {
    it('should set the value of a raw data property by key', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
      using instance = createNodeInstance(flow, { node })
      instance.setDataValue('value', 'Hello, World!')
      expect(instance.data).toStrictEqual({ value: 'Hello, World!' })
    })

    it('should emit the "data" event when the data is set', () => {
      using flow = createFlow()
      const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
      using instance = createNodeInstance(flow, { node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.setDataValue('value', 'Hello, World!')
      expect(listener).toHaveBeenCalledWith({ value: 'Hello, World!' })
    })
  })

  describe('refresh', () => {
    describe('resolveDataSchema', () => {
      describe('when dataSchema is an object', () => {
        it('should apply the dataSchema immediatly from the node definition', () => {
          using flow = createFlow()
          const port = { type: typeString }
          const node = defineNode({ kind: 'example', dataSchema: { value: port } })
          using instance = createNodeInstance(flow, { node })
          expect(instance.dataSchema).toStrictEqual({ value: port })
        })
      })

      describe('when dataSchema is a function', () => {
        it('should default dataSchema to an empty object', () => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: () => ({}) })
          using instance = createNodeInstance(flow, { node })
          expect(instance.dataSchema).toStrictEqual({})
        })

        it('should resolve dataSchema when calling resolveDataSchema', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: () => ({ value: { type: typeString } }) })
          using instance = createNodeInstance(flow, { node })
          await instance.refresh()
          expect(instance.dataSchema).toStrictEqual({ value: { type: typeString } })
        })

        it('should call the node\'s "dataSchema" function with the context of the node instance', async() => {
          using flow = createFlow()
          const dataSchema = vi.fn(() => ({}))
          const node = defineNode({ kind: 'example', dataSchema })
          using instance = createNodeInstance(flow, { node })
          await instance.refresh()
          expect(dataSchema).toHaveBeenCalledOnce()
          expect(dataSchema).toHaveBeenCalledWith({
            abortSignal: instance.abortController.signal,
            data: instance.data,
            result: instance.result,
          })
        })

        it('should emit the "dataSchema" event when the data schema is resolved', async() => {
          using flow = createFlow()
          const port = { type: typeString }
          const node = defineNode({ kind: 'example', dataSchema: () => ({ value: port }) })
          using instance = createNodeInstance(flow, { node })
          const listener = vi.fn()
          instance.on('dataSchema', listener)
          await instance.refresh()
          expect(listener).toHaveBeenCalledOnce()
          expect(listener).toHaveBeenCalledWith({ value: port })
        })
      })
    })

    describe('resolveResultSchema', () => {
      describe('when resultSchema is an object', () => {
        it('should apply the resultSchema immediatly', () => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', resultSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node })
          expect(instance.resultSchema).toStrictEqual(node.resultSchema)
        })
      })

      describe('when resultSchema is a function', () => {
        it('should default resultSchema to an empty object', () => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', resultSchema: () => ({}) })
          using instance = createNodeInstance(flow, { node })
          expect(instance.resultSchema).toStrictEqual({})
        })

        it('should resolve resultSchema when calling resolveResultSchema', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', resultSchema: () => ({ value: { type: typeString } }) })
          using instance = createNodeInstance(flow, { node })
          await instance.refresh()
          expect(instance.resultSchema).toStrictEqual({ value: { type: typeString } })
        })

        it('should call the node\'s "resultSchema" function with the context of the node instance', async() => {
          using flow = createFlow()
          const resultSchema = vi.fn(() => ({}))
          const node = defineNode({ kind: 'example', resultSchema })
          using instance = createNodeInstance(flow, { node })
          await instance.refresh()
          expect(resultSchema).toHaveBeenCalledOnce()
          expect(resultSchema).toHaveBeenCalledWith({
            abortSignal: instance.abortController.signal,
            data: instance.data,
            result: instance.result,
          })
        })

        it('should emit the "resultSchema" event when the result schema is resolved', async() => {
          using flow = createFlow()
          const port = { type: typeString }
          const node = defineNode({ kind: 'example', resultSchema: () => ({ value: port }) })
          using instance = createNodeInstance(flow, { node })
          const listener = vi.fn()
          instance.on('resultSchema', listener)
          await instance.refresh()
          expect(listener).toHaveBeenCalledOnce()
          expect(listener).toHaveBeenCalledWith({ value: port })
        })
      })
    })

    describe('resolveData', () => {
      describe('when key is not present in the data schema', () => {
        it('should omit properties that are not defined in the data schema', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(flow, { node, initialData: { value: 'Hello, World!', number: 42 } })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: 'Hello, World!' })
        })

        it('should resolve dataSchema before resolving data', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: () => ({ value: { type: typeString } }) })
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(flow, { node, initialData: { value: 'Hello, World!', number: 42 } })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: 'Hello, World!' })
        })

        it('should flag the node as ready even if additional properties are present', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(flow, { node, initialData: { value: 'Hello, World!', number: 42 } })
          const isReady = await instance.refresh()
          expect(isReady).toBe(true)
        })
      })

      describe('when value is undefined', () => {
        it('should return undefined if no default value is provided', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: undefined })
        })

        it('should return the default value if provided', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString, defaultValue: 'Hello, World!' } } })
          using instance = createNodeInstance(flow, { node })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: 'Hello, World!' })
        })

        it('should flag the node as ready if the socket is optional', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString, isOptional: true } } })
          using instance = createNodeInstance(flow, { node })
          const isReady = await instance.refresh()
          expect(isReady).toBe(true)
        })

        it('should flag the node as not ready if the socket is required', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString, isOptional: false } } })
          using instance = createNodeInstance(flow, { node })
          const isReady = await instance.refresh()
          expect(isReady).toBe(false)
        })
      })

      describe('when raw value is provided', () => {
        it('should parse and return the value using the type\'s parser', async() => {
          using flow = createFlow()
          const type = { kind: 'string', parse: vi.fn(String) }
          const node = defineNode({ kind: 'example', dataSchema: { value: { type } } })
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(flow, { node, initialData: { value: 42 } })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: '42' })
          expect(type.parse).toHaveBeenCalledOnce()
          expect(type.parse).toHaveBeenCalledWith(42)
        })

        it('should flag the node as ready if the value was correctly parsed', async() => {
          using flow = createFlow()
          const type = { kind: 'string', parse: vi.fn(String) }
          const node = defineNode({ kind: 'example', dataSchema: { value: { type } } })
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(flow, { node, initialData: { value: 42 } })
          const isReady = await instance.refresh()
          expect(isReady).toBe(true)
        })

        it('should collect the errors if the value cannot be parsed', async() => {
          using flow = createFlow()
          const type = { kind: 'string', parse: () => { throw new Error('Parsing error') } }
          const node = defineNode({ kind: 'example', dataSchema: { value: { type } } })
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(flow, { node, initialData: { value: 42 } })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({})
          expect(instance.dataErrors).toStrictEqual({ value: new Error('Parsing error') })
        })

        it('should dispatch a "dataError" event if the value cannot be parsed', async() => {
          using flow = createFlow()
          const type = { kind: 'string', parse: () => { throw new Error('Parsing error') } }
          const node = defineNode({ kind: 'example', dataSchema: { value: { type } } })
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(flow, { node, initialData: { value: 42 } })
          const listener = vi.fn()
          instance.on('dataError', listener)
          await instance.refresh()
          const error = new Error('Parsing error')
          expect(listener).toHaveBeenCalledOnce()
          expect(listener).toHaveBeenCalledWith('value', error)
        })

        it('should flag the node as not ready if a parsing error occurs', async() => {
          using flow = createFlow()
          const type = { kind: 'string', parse: () => { throw new Error('Parsing error') } }
          const node = defineNode({ kind: 'example', dataSchema: { value: { type } } })
          // @ts-expect-error: Type mismatch.
          using instance = createNodeInstance(flow, { node, initialData: { value: 42 } })
          const isReady = await instance.refresh()
          expect(isReady).toBe(false)
        })
      })

      describe('when value is a variable', () => {
        it('should resolve and parse the variable value', async() => {
          using flow = createFlow({ resolveVariable: name => ({ GREET: 'Hello, World!' }[name]) })
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node, initialData: { value: '$VARIABLE.GREET' } })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: 'Hello, World!' })
        })

        it('should collect the errors if the variable does not exist', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node, initialData: { value: '$VARIABLE.NON_EXISTENT' } })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({})
          expect(instance.dataErrors).toStrictEqual({ value: new Error('Variable "NON_EXISTENT" does not exist or is not accessible') })
        })

        it('should dispatch a "dataError" event if the variable does not exist', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node, initialData: { value: '$VARIABLE.NON_EXISTENT' } })
          const listener = vi.fn()
          instance.on('dataError', listener)
          await instance.refresh()
          const error = new Error('Variable "NON_EXISTENT" does not exist or is not accessible')
          expect(listener).toHaveBeenCalledOnce()
          expect(listener).toHaveBeenCalledWith('value', error)
        })

        it('should call the resolveVariable method of the flow', async() => {
          const resolveVariable = vi.fn(() => 'Hello, World!')
          using flow = createFlow({ resolveVariable })
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node, initialData: { value: '$VARIABLE.GREET' } })
          await instance.refresh()
          expect(resolveVariable).toHaveBeenCalledOnce()
          expect(resolveVariable).toHaveBeenCalledWith('GREET')
        })

        it('should flag the node as ready if the variable exists', async() => {
          using flow = createFlow({ resolveVariable: () => 'Hello, World!' })
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node, initialData: { value: '$VARIABLE.GREET' } })
          const isReady = await instance.refresh()
          expect(isReady).toBe(true)
        })

        it('should flag the node as not ready if the variable does not exist', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node, initialData: { value: '$VARIABLE.NON_EXISTENT' } })
          const isReady = await instance.refresh()
          expect(isReady).toBe(false)
        })
      })

      describe('when value is a secret', () => {
        it('should resolve and parse the secret value', async() => {
          using flow = createFlow({ resolveSecret: name => ({ GREET: 'Hello, World!' }[name]) })
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node, initialData: { value: '$SECRET.GREET' } })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({ value: 'Hello, World!' })
        })

        it('should collect the errors if the secret does not exist', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node, initialData: { value: '$SECRET.NON_EXISTENT' } })
          await instance.refresh()
          expect(instance.dataResolved).toStrictEqual({})
          expect(instance.dataErrors).toStrictEqual({ value: new Error('Secret "NON_EXISTENT" does not exist or is not accessible') })
        })

        it('should dispatch a "dataError" event if the secret does not exist', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node, initialData: { value: '$SECRET.NON_EXISTENT' } })
          const listener = vi.fn()
          instance.on('dataError', listener)
          await instance.refresh()
          const error = new Error('Secret "NON_EXISTENT" does not exist or is not accessible')
          expect(listener).toHaveBeenCalledOnce()
          expect(listener).toHaveBeenCalledWith('value', error)
        })

        it('should call the resolveSecret method of the flow', async() => {
          const resolveSecret = vi.fn(() => 'Hello, World!')
          using flow = createFlow({ resolveSecret })
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node, initialData: { value: '$SECRET.GREET' } })
          await instance.refresh()
          expect(resolveSecret).toHaveBeenCalledOnce()
          expect(resolveSecret).toHaveBeenCalledWith('GREET')
        })

        it('should flag the node as ready if the secret exists', async() => {
          using flow = createFlow({ resolveSecret: () => 'Hello, World!' })
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node, initialData: { value: '$SECRET.GREET' } })
          const isReady = await instance.refresh()
          expect(isReady).toBe(true)
        })

        it('should flag the node as not ready if the secret does not exist', async() => {
          using flow = createFlow()
          const node = defineNode({ kind: 'example', dataSchema: { value: { type: typeString } } })
          using instance = createNodeInstance(flow, { node, initialData: { value: '$SECRET.NON_EXISTENT' } })
          const isReady = await instance.refresh()
          expect(isReady).toBe(false)
        })
      })

      describe('when value is a node reference', () => {
        it('should resolve source node result that is already done', async() => {
          using flow = createFlow()
          const nodeIn = defineNode({ kind: 'example-in', resultSchema: { value: { type: typeString } } })
          const nodeOut = defineNode({ kind: 'example-out', dataSchema: { value: { type: typeString } } })
          using instanceIn = flow.add(nodeIn, { initialResult: { value: 'Hello, World!' } })
          using instanceOut = flow.add(nodeOut, { initialData: { value: `$NODE.${instanceIn.id}:value` } })
          instanceIn.isDone = true
          await instanceOut.refresh()
          expect(instanceOut.dataResolved).toStrictEqual({ value: 'Hello, World!' })
        })

        it('should flag the node as ready if the source node is done', async() => {
          using flow = createFlow()
          const nodeIn = defineNode({ kind: 'example-in', resultSchema: { value: { type: typeString } } })
          const nodeOut = defineNode({ kind: 'example-out', dataSchema: { value: { type: typeString } } })
          using instanceIn = flow.add(nodeIn, { initialResult: { value: 'Hello, World!' } })
          using instanceOut = flow.add(nodeOut, { initialData: { value: `$NODE.${instanceIn.id}:value` } })
          instanceIn.isDone = true
          const isReady = await instanceOut.refresh()
          expect(isReady).toBe(true)
        })

        it('should omit property when source node is not done', async() => {
          using flow = createFlow()
          const nodeIn = defineNode({ kind: 'example-in', resultSchema: { value: { type: typeString } } })
          const nodeOut = defineNode({ kind: 'example-out', dataSchema: { value: { type: typeString } } })
          using instanceIn = flow.add(nodeIn, { initialResult: { value: 'Hello, World!' } })
          using instanceOut = flow.add(nodeOut, { initialData: { value: `$NODE.${instanceIn.id}:value` } })
          await instanceOut.refresh()
          expect(instanceOut.dataResolved).toStrictEqual({})
        })

        it('should flag the node as not ready if the source node is not done', async() => {
          using flow = createFlow()
          const nodeIn = defineNode({ kind: 'example-in', resultSchema: { value: { type: typeString } } })
          const nodeOut = defineNode({ kind: 'example-out', dataSchema: { value: { type: typeString } } })
          using instanceIn = flow.add(nodeIn, { initialResult: { value: 'Hello, World!' } })
          using instanceOut = flow.add(nodeOut, { initialData: { value: `$NODE.${instanceIn.id}:value` } })
          const isReady = await instanceOut.refresh()
          expect(isReady).toBe(false)
        })

        it('should collect error if node with the given id does not exist', async() => {
          using flow = createFlow()
          const nodeOut = defineNode({ kind: 'example-out', dataSchema: { value: { type: typeString } } })
          using instanceOut = flow.add(nodeOut, { initialData: { value: '$NODE.NON_EXISTENT:value' } })
          await instanceOut.refresh()
          const error = new Error('The node with ID "NON_EXISTENT" does not exist')
          expect(instanceOut.dataErrors).toStrictEqual({ value: error })
        })

        it('should dispatch a "dataError" event if the source node does not exist', async() => {
          using flow = createFlow()
          const nodeOut = defineNode({ kind: 'example-out', dataSchema: { value: { type: typeString } } })
          using instanceOut = flow.add(nodeOut, { initialData: { value: '$NODE.NON_EXISTENT:value' } })
          const listener = vi.fn()
          instanceOut.on('dataError', listener)
          await instanceOut.refresh()
          const error = new Error('The node with ID "NON_EXISTENT" does not exist')
          expect(listener).toHaveBeenCalledOnce()
          expect(listener).toHaveBeenCalledWith('value', error)
        })

        it('should flag the node as not ready if the source node does not exist', async() => {
          using flow = createFlow()
          const nodeOut = defineNode({ kind: 'example-out', dataSchema: { value: { type: typeString } } })
          using instanceOut = flow.add(nodeOut, { initialData: { value: '$NODE.NON_EXISTENT:value' } })
          const isReady = await instanceOut.refresh()
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
      process: ({ data }) => ({ output: data.input }),
    })

    it('should resolve data correctly before processing', async() => {
      using flow = createFlow()
      using instance = createNodeInstance(flow, { node, initialData: { input: 'Hello' } })
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
      using flow = createFlow()
      const node = defineNode({ kind: 'example', dataSchema: { input: { type: typeString } } })
      using instance = createNodeInstance(flow, { node })
      const listener = vi.fn()
      instance.on('start', listener)
      await instance.start()
      expect(listener).not.toHaveBeenCalled()
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
      instance.dispatch('data', { value: 'Hello, World!' })
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
      // @ts-expect-error: Private method.
      instance.dispatch('data', { value: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })
  })
})
