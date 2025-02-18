import type { NodeState, Thread } from '@nwrx/nano'
import type { ComponentJSON } from './serializeComponent'
import type { InputJSON } from './serializeInputSchema'
import type { OutputJSON } from './serializeOutputSchema'
import { getNode, getNodeComponent } from '@nwrx/nano'
import { serializeSpecifier } from '@nwrx/nano/utils'
import { serializeInputSchema } from './serializeInputSchema'
import { serializeOutputSchema } from './serializeOutputSchema'

export interface ComponentInstanceJSON extends ComponentJSON {
  id: string

  // Component
  kind: string
  name: string
  icon: string
  categoryKind: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
  categoryDescription: string
  description: string
  inputSchema: InputJSON[]
  outputSchema: OutputJSON[]

  // Node
  state: NodeState
  error?: string
  errorName?: string
  errorContext?: Record<string, unknown>
  label?: string
  comment?: string
  position: { x: number; y: number }
  inputVisibility: Record<string, unknown>
  outputVisibility: Record<string, unknown>
  input: Record<string, unknown>
  output: Record<string, unknown>
}

export async function serializeComponentInstance(thread: Thread, id: string): Promise<ComponentInstanceJSON> {
  const node = getNode(thread, id)
  const component = await getNodeComponent(thread, id)
  return {
    id,
    kind: serializeSpecifier(node),
    icon: component.icon ?? 'https://api.iconify.design/carbon:unknown.svg',
    name: node.name,
    description: component.description ?? 'No description available.',
    categoryKind: 'uncategorized',
    categoryName: 'Uncategorized',
    categoryIcon: 'https://api.iconify.design/carbon:unknown.svg',
    categoryColor: '#000000',
    categoryDescription: 'No description available.',
    inputSchema: serializeInputSchema(component.inputs),
    outputSchema: serializeOutputSchema(component.outputs),
    state: 'idle',
    error: node.error?.message,
    errorName: node.error?.name,
    // errorContext: node.error?.context,
    label: node.metadata?.label,
    comment: node.metadata?.comment,
    position: node.metadata?.position ?? { x: 0, y: 0 },
    inputVisibility: node.metadata?.inputVisibility ?? {},
    outputVisibility: node.metadata?.outputVisibility ?? {},
    input: node.input ?? {},
    output: {},
  }
}
