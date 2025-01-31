import type { moduleCore, nodeInput, nodeJsonParse, nodeOutput } from './__fixtures__'
import type { Flow } from './createFlow'
import type { SocketType } from './defineSocketType'
import type {
  InferData,
  InferDataKeys,
  InferDataSchema,
  InferDataValue,
  InferNode,
  InferNodeByKind,
  InferNodeKind,
  InferResult,
  InferResultKeys,
  InferResultSchema,
  InferResultValue,
  InferSchemaKeys,
  InferSchemaType,
  InferSchemaValue,
} from './types'

describe('types', () => {
  describe('infer node', () => {
    it('should infer the nodes of a `Flow` instance', () => {
      type FlowInstance = Flow<typeof moduleCore>
      type Result = InferNode<FlowInstance>
      expectTypeOf<Result>().toEqualTypeOf<typeof nodeInput | typeof nodeJsonParse | typeof nodeOutput>()
    })

    it('should infer the node kind of a `FlowModule` instance', () => {
      type Result = InferNode<typeof moduleCore>
      expectTypeOf<Result>().toEqualTypeOf<typeof nodeInput | typeof nodeJsonParse | typeof nodeOutput>()
    })

    it('should infer the node kind of a `Flow` instance', () => {
      type FlowInstance = Flow<typeof moduleCore>
      type Result = InferNodeKind<FlowInstance>
      expectTypeOf<Result>().toEqualTypeOf<'nwrx/core:input' | 'nwrx/core:output' | 'nwrx/core:parse-json'>()
    })

    it('should infer the node kind of a `FlowModule` instance', () => {
      type Result = InferNodeKind<typeof moduleCore>
      expectTypeOf<Result>().toEqualTypeOf<'nwrx/core:input' | 'nwrx/core:output' | 'nwrx/core:parse-json'>()
    })

    it('should infer the node by kind of a `Flow` instance', () => {
      type FlowInstance = Flow<typeof moduleCore>
      type Result = InferNodeByKind<FlowInstance, 'nwrx/core:output'>
      expectTypeOf<Result>().toEqualTypeOf<typeof nodeOutput>()
    })

    it('should infer the node by kind of a `FlowModule` instance', () => {
      type Result = InferNodeByKind<typeof moduleCore, 'nwrx/core:output'>
      expectTypeOf<Result>().toEqualTypeOf<typeof nodeOutput>()
    })
  })

  describe('infer schema', () => {
    it('should infer the raw type of a `FlowNodePort`', () => {
      type Result = InferSchemaType<{ value: { type: SocketType<string> } }>
      expectTypeOf<Result>().toEqualTypeOf<{ value: string }>()
    })

    it('should infer the keys of a `FlowNodeSchema`', () => {
      type Result = InferSchemaKeys<{ value: { type: SocketType<string> } }>
      expectTypeOf<Result>().toEqualTypeOf<'value'>()
    })

    it('should infer the value type of a `FlowNodeSchema` by its key', () => {
      type Result = InferSchemaValue<{ value: { type: SocketType<string> } }, 'value'>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })
  })

  describe('infer result', () => {
    it('should infer the result schema of a `Node`', () => {
      type Result = InferResultSchema<typeof nodeJsonParse>
      expectTypeOf<Result>().toEqualTypeOf<{ object: { name: string; type: SocketType<object> } }>()
    })

    it('should infer the result of a `Node`', () => {
      type Result = InferResult<typeof nodeJsonParse>
      expectTypeOf<Result>().toEqualTypeOf<{ object: object }>()
    })

    it('should infer the keys of the result of a `Node`', () => {
      type Result = InferResultKeys<typeof nodeJsonParse>
      expectTypeOf<Result>().toEqualTypeOf<'object'>()
    })

    it('should infer the value of the result of a `Node`', () => {
      type Result = InferResultValue<typeof nodeJsonParse, 'object'>
      expectTypeOf<Result>().toEqualTypeOf<object>()
    })
  })

  describe('infer data', () => {
    it('should infer the data schema of a `Node`', () => {
      type Result = InferDataSchema<typeof nodeJsonParse>
      expectTypeOf<Result>().toEqualTypeOf<{ json: { name: string; type: SocketType<string> } }>()
    })

    it('should infer the data of a `Node`', () => {
      type Result = InferData<typeof nodeJsonParse>
      expectTypeOf<Result>().toEqualTypeOf<{ json: string }>()
    })

    it('should infer the keys of the data of a `Node`', () => {
      type Result = InferDataKeys<typeof nodeJsonParse>
      expectTypeOf<Result>().toEqualTypeOf<'json'>()
    })

    it('should infer the value of the data of a `Node`', () => {
      type Result = InferDataValue<typeof nodeJsonParse, 'json'>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })
  })
})
