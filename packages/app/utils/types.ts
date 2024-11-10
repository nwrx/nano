import type { FlowObject } from '@nwrx/api'
import type { MaybeLiteral } from '@unshared/types'
import type { RouteLocationRaw } from 'vue-router'
import type { application } from '~/server'
import type { COLORS } from '../uno.config'

declare module '@unserved/nuxt/types' {
  // @ts-expect-error: override the global application type.
  export type GlobalApplication = typeof application
}

export type Size = 'large' | 'medium' | 'small' | 'xlarge' | 'xsmall'
export type Variant = MaybeLiteral<keyof typeof COLORS>
export type Alignment = 'center' | 'left' | 'right'

export interface NavItem {
  icon?: string
  label?: string
  to?: RouteLocationRaw
  items?: NavItem[]
}

export interface FlowDragState {
  id: string
  color: string
  position: { x: number; y: number }
  kind: 'source' | 'target'
}

export interface FlowLinkProps {
  sourceX: number
  sourceY: number
  sourceColor: string
  targetX: number
  targetY: number
  targetColor: string
}

export interface FlowNodePosition {
  id: string
  x: number
  y: number
}

export interface CardProps {
  dark?: boolean
  rounded?: boolean
  centered?: boolean
  outlined?: boolean
  gradient?: boolean
  variant?: Variant
  as?: keyof HTMLElementTagNameMap
  classContainer?: string
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
