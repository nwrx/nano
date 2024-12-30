import type { NodeState } from '@nwrx/core'
import type { ComponentInstanceJSON } from './serializeComponentInstance'
import type { EditorSessionJSON } from './serializeSession'
import { assert, assertObjectStrict, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'

export const EDITOR_SESSION_SERVER_MESSAGE_SCHEMA = createRuleSet(

)

/** The message sent from the server to the client in a flow editor session. */
export type EditorSessionServerMessage = ReturnType<typeof EDITOR_SESSION_SERVER_MESSAGE_SCHEMA>
