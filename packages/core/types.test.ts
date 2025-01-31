import type { moduleCore, nodeInput, nodeJsonParse, nodeOutput } from './__fixtures__'
import type { Flow } from './createFlow'
import type { Type } from './defineType'
import type {
  NodeByKind,
  NodeData,
  NodeDataKeys,
  NodeDataSchema,
  NodeDataValue,
  NodeKind,
  NodeOf,
  NodeResult,
  NodeResultKeys,
  NodeResultSchema,
  NodeResultValue,
} from './types'

describe('types', () => {
  describe('infer node', () => {
    it('should infer the nodes of a `Flow` instance', () => {
      type FlowInstance = Flow<typeof moduleCore>
      type Result = NodeOf<FlowInstance>
      expectTypeOf<Result>().toEqualTypeOf<typeof nodeInput | typeof nodeJsonParse | typeof nodeOutput>()
    })

    it('should infer the node kind of a `Module` instance', () => {
      type Result = NodeOf<typeof moduleCore>
      expectTypeOf<Result>().toEqualTypeOf<typeof nodeInput | typeof nodeJsonParse | typeof nodeOutput>()
    })

    it('should infer the node kind of a `Flow` instance', () => {
      type FlowInstance = Flow<typeof moduleCore>
      type Result = NodeKind<FlowInstance>
      expectTypeOf<Result>().toEqualTypeOf<'nwrx/core:input' | 'nwrx/core:output' | 'nwrx/core:parse-json'>()
    })

    it('should infer the node kind of a `Module` instance', () => {
      type Result = NodeKind<typeof moduleCore>
      expectTypeOf<Result>().toEqualTypeOf<'nwrx/core:input' | 'nwrx/core:output' | 'nwrx/core:parse-json'>()
    })

    it('should infer the node by kind of a `Flow` instance', () => {
      type FlowInstance = Flow<typeof moduleCore>
      type Result = NodeByKind<FlowInstance, 'nwrx/core:output'>
      expectTypeOf<Result>().toEqualTypeOf<typeof nodeOutput>()
    })

    it('should infer the node by kind of a `Module` instance', () => {
      type Result = NodeByKind<typeof moduleCore, 'nwrx/core:output'>
      expectTypeOf<Result>().toEqualTypeOf<typeof nodeOutput>()
    })
  })

  describe('infer schema', () => {
    it('should infer the raw type of a `FlowNodePort`', () => {
      type Result = InferSchemaType<{ value: { type: Type<string> } }>
      expectTypeOf<Result>().toEqualTypeOf<{ value: string }>()
    })

    it('should infer the keys of a `FlowNodeSchema`', () => {
      type Result = InferSchemaKeys<{ value: { type: Type<string> } }>
      expectTypeOf<Result>().toEqualTypeOf<'value'>()
    })

    it('should infer the value type of a `FlowNodeSchema` by its key', () => {
      type Result = InferSchemaValue<{ value: { type: Type<string> } }, 'value'>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })
  })

  describe('infer result', () => {
    it('should infer the result schema of a `Node`', () => {
      type Result = NodeResultSchema<typeof nodeJsonParse>
      expectTypeOf<Result>().toEqualTypeOf<{ object: { name: string; type: Type<object> } }>()
    })

    it('should infer the result of a `Node`', () => {
      type Result = NodeResult<typeof nodeJsonParse>
      expectTypeOf<Result>().toEqualTypeOf<{ object: object }>()
    })

    it('should infer the keys of the result of a `Node`', () => {
      type Result = NodeResultKeys<typeof nodeJsonParse>
      expectTypeOf<Result>().toEqualTypeOf<'object'>()
    })

    it('should infer the value of the result of a `Node`', () => {
      type Result = NodeResultValue<typeof nodeJsonParse, 'object'>
      expectTypeOf<Result>().toEqualTypeOf<object>()
    })
  })

  describe('infer data', () => {
    it('should infer the data schema of a `Node`', () => {
      type Result = NodeDataSchema<typeof nodeJsonParse>
      expectTypeOf<Result>().toEqualTypeOf<{ json: { name: string; type: Type<string> } }>()
    })

    it('should infer the data of a `Node`', () => {
      type Result = NodeData<typeof nodeJsonParse>
      expectTypeOf<Result>().toEqualTypeOf<{ json: string }>()
    })

    it('should infer the keys of the data of a `Node`', () => {
      type Result = NodeDataKeys<typeof nodeJsonParse>
      expectTypeOf<Result>().toEqualTypeOf<'json'>()
    })

    it('should infer the value of the data of a `Node`', () => {
      type Result = NodeDataValue<typeof nodeJsonParse, 'json'>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })
  })
})
