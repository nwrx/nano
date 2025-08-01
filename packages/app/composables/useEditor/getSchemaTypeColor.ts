import type { FlowEditorComponent } from '@nwrx/nano-api'
import type { Schema } from '@nwrx/nano/utils'

export function getSchemaType(socket?: Schema) {
  if (!socket?.type) return 'unknown'
  if (typeof socket.type === 'string') return socket.type
  if (typeof socket['x-type'] === 'string') return socket['x-type']
  return 'unknown'
}

export function getSchemaTypeColor(socket?: Schema) {
  const typeRaw = getSchemaType(socket)
  if (typeRaw === 'string') return '#927721'
  if (typeRaw === 'number') return '#FF1648'
  if (typeRaw === 'boolean') return '#3386CF'
  if (typeRaw === 'object') return '#00FF00'
  if (typeRaw === 'array') return '#00FF00'
  if (typeRaw === 'integer') return '#FF00FF'
  if (typeRaw === 'null') return '#000000'
  if (typeRaw === 'stream') return '#FFA500'
  if (typeRaw === 'function') return '#FF0000'
  if (typeRaw === 'file') return '#EEDCFF'
  return '#888'
}

export function getComponentTypeColors(component: FlowEditorComponent) {
  const colors = new Set<string>()
  if (component.inputs) {
    for (const name in component.inputs) {
      const socket = component.inputs[name]
      const color = getSchemaTypeColor(socket)
      if (color) colors.add(color)
    }
  }
  if (component.outputs) {
    for (const name in component.outputs) {
      const socket = component.outputs[name]
      const color = getSchemaTypeColor(socket)
      if (color) colors.add(color)
    }
  }
  return [...colors]
}
