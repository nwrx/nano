import type { NodeState, Thread } from '@nwrx/nano'
import type { ComponentJSON } from './serializeComponent'
import { resolveComponent } from '@nwrx/nano'
import { getInstance } from '@nwrx/nano'
import { serializeComponent } from './serializeComponent'

export interface ComponentInstanceJSON extends ComponentJSON {
  id: string
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
  const componentInstance = getInstance(thread, id)
  const component = await resolveComponent(componentInstance.specifier, thread.componentResolvers)
  return {
    id,
    ...serializeComponent(component),
    state: 'IDLE',
    error: thread.nodes.get(id)?.error?.message,
    errorName: thread.nodes.get(id)?.error?.name,
    errorContext: thread.nodes.get(id)?.error?.context,
    label: componentInstance.metadata?.label,
    comment: componentInstance.metadata?.comment,
    position: componentInstance.metadata?.position ?? { x: 0, y: 0 },
    inputVisibility: componentInstance.metadata?.inputVisibility ?? {},
    outputVisibility: componentInstance.metadata?.outputVisibility ?? {},
    input: componentInstance.input ?? {},
    output: {},
  }
}
