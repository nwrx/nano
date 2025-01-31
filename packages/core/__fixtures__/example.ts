import type { FlowNodeDefinition } from '../module'
import { Core } from '@nwrx/module-core'
import { Flow } from '../flow'
import { createReference } from '../flow/createReference'

const flow = new Flow([], {
  resolveNode: [
    (kind) => {
      const moduleInstance = Object.values(Core.nodes).find(n => n.kind === kind)
      if (!moduleInstance) throw new Error(`Module not found: ${kind}`)
      return moduleInstance as unknown as FlowNodeDefinition
    },
  ],
})

flow.createNode({
  id: 'input-message',
  kind: 'core/input',
  input: {
    name: 'Message',
    description: 'The message to send.',
  },
  meta: {
    label: 'Message from user',
    comment: 'This is the message that the user sends to the system.',
  },
})

flow.createNode({
  id: 'transform-uppercase',
  kind: 'core/transform',
  input: {
    transform: 'uppercase',
    value: createReference('fromNode', {
      id: 'input-message',
      key: 'result',
    }),
  },
})

flow.createNode({
  id: 'message',
  kind: 'core/output',
  input: {
    name: 'Message',
    description: 'The message that was sent.',
    value: createReference('fromNode', {
      id: 'transform-uppercase',
      key: 'result',
    }),
  },
})
