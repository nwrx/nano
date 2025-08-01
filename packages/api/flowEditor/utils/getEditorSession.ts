import type { Peer } from 'crossws'
import type { ModuleFlowEditor } from '..'
import type { Flow } from '../../flow'
import { createThreadFromFlow } from '@nwrx/nano'
import { DEFAULT_COMPONENT_RESOLVER } from '@nwrx/nano/utils'
import { assert, createParser, createRuleSet } from '@unshared/validation'
import { assertFlow } from '../../flow/utils/assertFlow'
import { assertProject } from '../../project/utils/assertProject'
import { assertUser } from '../../user/utils/assertUser'
import { ModuleVault } from '../../vault'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'
import { EditorSession } from './createEditorSession'

/** Schema to validate the options to resolve the editor session. */
const GET_EDITOR_SESSION_OPTIONS_SCHEMA = createRuleSet(
  [createParser({
    user: assertUser,
    flow: assertFlow,
    project: assertProject,
    workspace: assertWorkspace,
  })],

  [createParser({
    peer: assert.object as (value: unknown) => asserts value is Peer,
  })],
)

/** Options to resolve the editor session. */
export type GetEditorSessionOptions = ReturnType<typeof GET_EDITOR_SESSION_OPTIONS_SCHEMA>

/**
 * Given an ID, create or get the `EditorSession` that corresponds to the ID of the flow.
 *
 * @param options The options to resolve the session.
 * @returns The `EditorSession` that corresponds to the given ID.
 */
export function getEditorSession(this: ModuleFlowEditor, options: GetEditorSessionOptions): EditorSession {
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
    componentResolvers: [
      DEFAULT_COMPONENT_RESOLVER,
    ],
    referenceResolvers: [async(type, ...values) => {
      if (type === 'Variables') {
        const [vault, name] = values
        return moduleVault.getVariableValue({ workspace, project, vault, name })
      }
    }],
  })
  const session = new EditorSession(this, project, flow, thread)
  this.flowEditorSessions.set(flow.id, session)
  return session
}
