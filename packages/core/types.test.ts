import type { moduleCore, nodeInput, nodeOutput, nodeParse } from './__fixtures__'
import type { NodeByKind, NodeKind, NodeOf } from './types'

describe('types', () => {
  it('should infer the nodes of a `Module` instance', () => {
    type Result = NodeOf<typeof moduleCore>
    expectTypeOf<Result>().toEqualTypeOf<typeof nodeInput | typeof nodeOutput | typeof nodeParse>()
  })

  it('should infer the node kinds of a `Module` instance', () => {
    type Result = NodeKind<typeof moduleCore>
    expectTypeOf<Result>().toEqualTypeOf<'nwrx/core:input' | 'nwrx/core:output' | 'nwrx/core:parse-json'>()
  })

  it('should infer the node by kind of a `Module` instance', () => {
    type Result = NodeByKind<typeof moduleCore, 'nwrx/core:output'>
    expectTypeOf<Result>().toEqualTypeOf<typeof nodeOutput>()
  })
})
