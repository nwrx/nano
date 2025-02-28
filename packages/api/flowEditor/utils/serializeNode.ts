import type { NodeState } from '@nwrx/nano'
import type { Schema } from '@nwrx/nano/utils'
import type { RegistryComponentObject } from '../../registry'
import type { EditorSession } from './createEditorSession'
import { getNode } from '@nwrx/nano'
import { serializeSpecifier } from '@nwrx/nano/utils'
import { ModuleRegistry } from '../../registry'

export interface EditorCategoryObject {
  name: string
  icon: string
  color: string
  description: string
}

export interface EditorComponentObject {
  name: string
  version: string
  workspace: { name: string }
  collection: { name: string }
  categories: EditorCategoryObject[]
}

export interface EditorNodeObject {
  id: string

  // Component
  specifier: string
  name: string
  icon: string
  category?: string
  description: string
  inputs: Record<string, Schema>
  outputs: Record<string, Schema>

  // component: RegistryComponentObject

  // Node
  state: NodeState
  error?: string
  errorName?: string
  errorContext?: Record<string, unknown>
  label?: string
  comment?: string
  position: { x: number; y: number }
  input: Record<string, unknown>
  output: Record<string, unknown>
}

export async function serializeNode(this: EditorSession, id: string): Promise<EditorNodeObject> {
  const moduleRegistry = this.moduleFlow.getModule(ModuleRegistry)
  const node = getNode(this.thread, id)
  const specifier = serializeSpecifier(node)
  const component = await moduleRegistry.resolveComponent({ specifier })
  const category = component.categories?.find(c => c.type === 'Purpose')

  return {
    id,

    specifier,
    icon: component.icon,
    label: component.title,
    inputs: component.inputs,
    outputs: component.outputs,
    description: component.description,
    category: category?.name,

    name: node.name,
    // categoryKind: registryComponent?.
    // categoryName: 'Uncategorized',
    // categoryIcon: 'https://api.iconify.design/carbon:unknown.svg',
    // categoryColor: '#000000',
    // categoryDescription: 'No description available.',

    state: 'idle',
    error: node.error?.message,
    errorName: node.error?.name,
    // errorContext: node.error?.context,
    comment: node.metadata?.comment,
    position: node.metadata?.position ?? { x: 0, y: 0 },
    input: node.input ?? {},
    output: node.result ?? {},
  }
}
