import type { EditorNodeObject, FlowObject } from '@nwrx/nano-api'
import type { ThreadServerMessage } from '@nwrx/nano-runner'
import type { MaybeLiteral } from '@unshared/types'
import type { RouteLocationRaw } from 'vue-router'

export type Size = 'large' | 'medium' | 'small' | 'xlarge' | 'xsmall'
export type Variant = MaybeLiteral<keyof typeof COLORS>
export type Alignment = 'center' | 'left' | 'right'

export type NavItemGroup =
  | 'admin-analytics'
  | 'admin-registry'
  | 'admin-server'
  | 'admin-settings'
  | 'admin-users'

  // Project Settings
  | 'project-billing'
  | 'project-security'
  | 'project-settings'

  // User
  | 'user-billing'
  | 'user-security'
  | 'user-settings'

  // Workspace
  | 'workspace-billing'
  | 'workspace-mcp'
  | 'workspace-mcp-pool'
  | 'workspace-mcp-server'
  | 'workspace-security'
  | 'workspace-settings'

export interface Stringtable {
  fr?: string
  en?: string
  de?: string
  es?: string
  zh?: string
}

export interface NavItem {
  icon?: string
  label?: string
  to?: RouteLocationRaw
  items?: NavItem[]
}

export interface DropPayload {
  type: 'createNode'
  kind: string
}

export interface ProjectListItem {
  name: string
  icon?: string
  description?: string
  collaborators: Array<{ id: string; name: string; imageUrl: string }>
  flows?: FlowObject[]
}

export type RouteGroup =
  | 'nav-items-bottom'
  | 'nav-items-top'
  | 'nav-items-workspace'
  | NavItemGroup

declare module 'vue-router' {
  export interface RouteMeta {
    icon?: string
    title?: string | Stringtable
    description?: string | Stringtable
    parent?: string
    group?: NavItemGroup
    groups?: RouteGroup[]
    isWorkInProgress?: boolean
  }
}

export type EditorMessageTreeItemLine =
  | 'close'
  | 'end'
  | 'open'
  | 'start'
  | 'straight'

export interface EditorMessageTreeItemTree {
  color: string
  showPin: boolean
  showLine: EditorMessageTreeItemLine
}

export interface EditorMessageTreeItem {
  message: ThreadServerMessage
  node?: EditorNodeObject
  tree?: EditorMessageTreeItemTree[]
}
