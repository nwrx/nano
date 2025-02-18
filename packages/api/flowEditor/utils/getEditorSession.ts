import type { ModuleFlow } from '..'
import type { User } from '../../user'
import { EditorSession } from './createEditorSession'
import { getFlow } from './getFlow'
import { loadThreadFromJson } from './loadThreadFromJson'

export interface ResolveEditorSessionOptions {
  workspace: string
  project: string
  name: string
  user: User
}

/**
 * Given an ID, create or get the `FlowSession` that corresponds to the ID of the flow.
 *
 * @param options The options to resolve the session.
 * @returns The `FlowSession` that corresponds to the given ID.
 */
export async function getEditorSession(this: ModuleFlow, options: ResolveEditorSessionOptions): Promise<EditorSession> {
  const { user, workspace, project, name } = options

  // --- Resolve the flow and check if the user has access to it.
  const flow = await getFlow.call(this, { user, name, project, workspace, permission: 'Write' })
  const exists = this.flowEditorSessions.get(flow.id)
  if (exists) return exists

  // --- Create the flow session and store it in memory.
  const { Flow } = this.getRepositories()
  const thread = loadThreadFromJson.call(this, flow)
  const session = new EditorSession(this, thread, flow, Flow)
  this.flowEditorSessions.set(flow.id, session)

  // --- Start monitoring the flow thread.
  return session
}
