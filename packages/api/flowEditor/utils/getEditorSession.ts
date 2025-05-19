import type { Peer } from 'crossws'
import type { ModuleFlowEditor } from '..'
import type { Flow } from '../../flow'
import { createThreadFromFlow } from '@nwrx/nano'
import { COMPONENTS } from '@nwrx/nano/components'
import { defineComponent, serializeSpecifier } from '@nwrx/nano/utils'
import { assert, createRuleSet, createSchema } from '@unshared/validation'
import { assertFlow } from '../../flow'
import { assertProject } from '../../project'
import { ModuleRegistry } from '../../registry'
import { assertUser } from '../../user'
import { ModuleVault } from '../../vault'
import { assertWorkspace } from '../../workspace'
import { EditorSession } from './createEditorSession'

/** Schema to validate the options to resolve the editor session. */
const GET_EDITOR_SESSION_OPTIONS_SCHEMA = createRuleSet(
  [createSchema({
    user: assertUser,
    flow: assertFlow,
    project: assertProject,
    workspace: assertWorkspace,
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
  const moduleRegistry = this.getModule(ModuleRegistry)
  const moduleVault = this.getModule(ModuleVault)
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
  // @ts-expect-error: At this point, the flow is guaranteed to be defined.
  const flow = options.flow as Flow
  const { project, workspace /* , user */ } = parsedOptions
  const exists = this.flowEditorSessions.get(flow.id)
  if (exists) return exists

  // --- Create the flow session and store it in memory.
  const thread = createThreadFromFlow(flow.data, {
    componentResolvers: [async(specifierObject) => {
      if (specifierObject.workspace === 'nanoworks' && specifierObject.registry === 'default') {
        const component = COMPONENTS[specifierObject.name as keyof typeof COMPONENTS]
        if (component) return component
        throw new Error(`Component "${specifierObject.name}" not found in the collection "${specifierObject.collection}"`)
      }

      const specifier = serializeSpecifier(specifierObject)
      const registryComponent = await moduleRegistry.resolveComponent({ specifier })
      return defineComponent({
        inputs: registryComponent.inputs,
        outputs: registryComponent.outputs,
      })
    }],
    referenceResolvers: [async(type, ...values) => {
      if (type === 'Variables') {
        const [vault, name] = values
        return moduleVault.getVariableValue({ workspace, project, vault, name })
      }
    }],
  })
  const session = new EditorSession(this, { flow, project, thread, workspace })
  this.flowEditorSessions.set(flow.id, session)

  // --- Start monitoring the flow thread.
  return session
}
