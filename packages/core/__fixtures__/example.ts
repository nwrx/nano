import type { Component } from '../module'
import { Core } from '../../module-core'
import { Thread } from '../thread'
import { createReference } from '../utils'
import { addComponentInstance } from '../utils/addComponentInstance'

const thread = new Thread({
  componentResolvers: [
    (kind) => {
      const moduleInstance = Object.values(Core.nodes).find(n => n.kind === kind)
      if (!moduleInstance) throw new Error(`Module not found: ${kind}`)
      return moduleInstance as unknown as Component
    },
  ],
})

addComponentInstance(thread, {
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

addComponentInstance(thread, {
  id: 'transform-uppercase',
  kind: 'core/transform',
  input: {
    transform: 'uppercase',
    value: createReference('fromNode', {
      id: 'input-message',
      key: 'value',
    }),
  },
})

addComponentInstance(thread, {
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
