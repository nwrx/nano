import type { RouteLocationRaw } from 'vue-router'
import type { application } from '~/server'
import type * as COLORS from './colors'

declare module '@unserved/nuxt/types' {
  // @ts-expect-error: override the global application type.
  export type GlobalApplication = typeof application
}

export type Size = 'large' | 'medium' | 'small'
export type Variant = keyof typeof COLORS
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
  kind: 'data' | 'result'
}

export interface FlowLinkProps {
  sourceX: number
  sourceY: number
  sourceColor: string
  targetX: number
  targetY: number
  targetColor: string
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

export type DropPayload =
  { type: 'createLink'; source: string; target: string } |
  { type: 'createNode'; kind: string }
