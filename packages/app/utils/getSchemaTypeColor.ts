import type { EditorNodeObject, RegistryComponentObject } from '@nwrx/nano-api'
import type { Schema } from '@nwrx/nano/utils'

export function getSchemaType(socket?: Schema) {
  if (!socket?.type) return
  if (Array.isArray(socket.type)) return socket.type[0]
  if (typeof socket.type === 'string') return socket.type
  if (typeof socket['x-type'] === 'string') return socket['x-type']
}

export function getNodeColor(node: EditorNodeObject) {
  if (!node.category) return '#000000'
  if (node.category === 'control') return '#FF0000'
  if (node.category === 'models') return '#00FF00'
  if (node.category === 'processing') return '#0000FF'
  if (node.category === 'storage') return '#0000FF'
}

export function getSchemaTypeColor(socket?: Schema) {
  const typeRaw = getSchemaType(socket)
  // // "string" | "number" | "boolean" | "object" | "function" | "stream" | "file" | "integer" | "null" | "array" | undefined
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

export function getComponentTypeColors(component: RegistryComponentObject) {
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

export function getVaultTypeIcon(type: string) {
  if (type === 'hashicorp') return 'i-simple-icons:hashicorp'
  if (type === 'aws') return 'i-simple-icons:awssecretsmanager'
  if (type === 'gcp') return 'i-simple-icons:googlecloud'
  if (type === 'azure') return 'i-simple-icons:microsoftazure'
  return 'i-carbon:locked'
}
