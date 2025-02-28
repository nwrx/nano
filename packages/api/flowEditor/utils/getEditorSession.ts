import type { Peer } from 'crossws'
import type { ModuleFlowEditor } from '..'
import { createThreadFromFlow } from '@nwrx/nano'
import { defineComponent, serializeSpecifier } from '@nwrx/nano/utils'
import { assert, createRuleSet, createSchema } from '@unshared/validation'
import { assertFlow, ModuleFlow } from '../../flow'
import { ModuleRegistry } from '../../registry'
import { assertUser } from '../../user'
import { EditorSession } from './createEditorSession'

/** Schema to validate the options to resolve the editor session. */
const GET_EDITOR_SESSION_OPTIONS_SCHEMA = createRuleSet(
  [createSchema({
    user: assertUser,
    flow: assertFlow,
  })],

  [createSchema({
    peer: assert.object as (value: unknown) => asserts value is Peer,
  })],
)

/** Options to resolve the editor session. */
export type ResolveEditorSessionOptions = ReturnType<typeof GET_EDITOR_SESSION_OPTIONS_SCHEMA>

/**
 * Given an ID, create or get the `FlowSession` that corresponds to the ID of the flow.
 *
 * @param options The options to resolve the session.
 * @returns The `FlowSession` that corresponds to the given ID.
 */
export function getEditorSession(this: ModuleFlowEditor, options: ResolveEditorSessionOptions): EditorSession {
  const moduleFlow = this.getModule(ModuleFlow)
  const moduleRegistry = this.getModule(ModuleRegistry)
  const parsedOptions = GET_EDITOR_SESSION_OPTIONS_SCHEMA(options)

  // --- Fasttrack the resolution of the session by peer.
  if ('peer' in parsedOptions) {
    for (const [,session] of this.flowEditorSessions) {
      for (const sessionPeer of session.participants)
        if (sessionPeer.peer.id === parsedOptions.peer.id) return session
    }
    throw new Error('Session not found.')
  }

  // --- If a session already exists for the flow, return it.
  const { flow /* , user */ } = parsedOptions
  const exists = this.flowEditorSessions.get(flow.id)
  if (exists) return exists

  // --- Create the flow session and store it in memory.
  const { Flow } = moduleFlow.getRepositories()
  const thread = createThreadFromFlow(flow.data, {
    componentResolvers: [async(specifierObject) => {
      if (specifierObject.workspace === 'nanoworks') specifierObject.workspace = 'default'
      if (specifierObject.collection === 'core') specifierObject.collection = 'default'
      const specifier = serializeSpecifier(specifierObject)
      const registryComponent = await moduleRegistry.resolveComponent({ specifier })
      return defineComponent({
        inputs: registryComponent.inputs,
        outputs: registryComponent.outputs,
      })
    }],
  })
  const session = new EditorSession(this, thread, flow, Flow)
  this.flowEditorSessions.set(flow.id, session)

  // --- Start monitoring the flow thread.
  return session
}
