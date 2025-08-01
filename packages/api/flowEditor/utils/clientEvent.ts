import { createRuleSet } from '@unshared/validation'
import { MESSAGE_CLIENT_METADATA_UPDATE_SCHEMA, MESSAGE_CLIENT_REQUEST_EXPORT_SCHEMA } from './eventHandlers'
import { MESSAGE_CLIENT_NODES_CLONE_SCHEMA } from './eventHandlers/handleNodesClone'
import { MESSAGE_CLIENT_NODES_CREATE_SCHEMA } from './eventHandlers/handleNodesCreate'
import { MESSAGE_CLIENT_NODES_INPUT_UPDATE_SCHEMA } from './eventHandlers/handleNodesInputUpdate'
import { MESSAGE_CLIENT_NODES_LINKS_CREATE_SCHEMA } from './eventHandlers/handleNodesLinksCreate'
import { MESSAGE_CLIENT_NODES_LINKS_REMOVE_SCHEMA } from './eventHandlers/handleNodesLinksRemove'
import { MESSAGE_CLIENT_NODES_METADATA_UPDATE_SCHEMA } from './eventHandlers/handleNodesMetadataUpdate'
import { MESSAGE_CLIENT_NODES_OPTIONS_SEARCH_SCHEMA } from './eventHandlers/handleNodesOptionsSearch'
import { MESSAGE_CLIENT_NODES_REMOVE_SCHEMA } from './eventHandlers/handleNodesRemove'
import { MESSAGE_CLIENT_REQUEST_RELOAD_SCHEMA } from './eventHandlers/handleRequestReload'
import { MESSAGE_CLIENT_USER_LEAVE_SCHEMA } from './eventHandlers/handleUserLeave'
import { MESSAGE_CLIENT_USER_MOVE_SCHEMA } from './eventHandlers/handleUserMove'

export const MESSAGE_CLIENT_SCHEMA = createRuleSet(
  [MESSAGE_CLIENT_METADATA_UPDATE_SCHEMA],
  [MESSAGE_CLIENT_REQUEST_RELOAD_SCHEMA],
  [MESSAGE_CLIENT_REQUEST_EXPORT_SCHEMA],

  // Nodes
  [MESSAGE_CLIENT_NODES_CREATE_SCHEMA],
  [MESSAGE_CLIENT_NODES_CLONE_SCHEMA],
  [MESSAGE_CLIENT_NODES_REMOVE_SCHEMA],
  [MESSAGE_CLIENT_NODES_INPUT_UPDATE_SCHEMA],
  [MESSAGE_CLIENT_NODES_METADATA_UPDATE_SCHEMA],
  [MESSAGE_CLIENT_NODES_OPTIONS_SEARCH_SCHEMA],
  [MESSAGE_CLIENT_NODES_LINKS_CREATE_SCHEMA],
  [MESSAGE_CLIENT_NODES_LINKS_REMOVE_SCHEMA],

  // User
  [MESSAGE_CLIENT_REQUEST_RELOAD_SCHEMA],
  [MESSAGE_CLIENT_USER_MOVE_SCHEMA],
  [MESSAGE_CLIENT_USER_LEAVE_SCHEMA],
)

/** The message received from the client in a flow session. */
export type EditorSessionClientMessage = ReturnType<typeof MESSAGE_CLIENT_SCHEMA>
export type EditorSessionClientMessageEvent = EditorSessionClientMessage['event']
