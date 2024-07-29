export interface ChainDragState {
  id: string
  color: string
  position: { x: number; y: number }
  kind: 'data' | 'result'
}

export interface ChainNodePosition {
  x: number
  y: number
}

export interface ChainLinkProps {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  color: string
}
