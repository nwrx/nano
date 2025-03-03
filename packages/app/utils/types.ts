import type { FlowObject } from '@nwrx/nano-api'
import type { MaybeLiteral } from '@unshared/types'
import type { RouteLocationRaw } from 'vue-router'

export type Size = 'large' | 'medium' | 'small' | 'xlarge' | 'xsmall'
export type Variant = MaybeLiteral<keyof typeof COLORS>
export type Alignment = 'center' | 'left' | 'right'

export type NavItemGroup =
  | 'administration'

  // Project Settings
  | 'project-billing'
  | 'project-security'
  | 'project-settings'

  // User Settings
  | 'user-billing'
  | 'user-security'
  | 'user-settings'

  // Workspace Settings
  | 'workspace-billing'
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

declare module 'vue-router' {
  export interface RouteMeta {
    icon?: string
    title?: string | Stringtable
    description?: string | Stringtable
    group?: NavItemGroup
  }
}
