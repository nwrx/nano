import type { NodeState, Thread } from '@nwrx/core'
import type { ComponentJSON } from './serializeComponent'
import { resolveComponent } from '@nwrx/core'
import { getComponentInstance } from '@nwrx/core'
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
  input: Record<string, unknown>
  output: Record<string, unknown>
}

export async function serializeComponentInstance(thread: Thread, id: string): Promise<ComponentInstanceJSON> {
  const componentInstance = getComponentInstance(thread, id)
  const component = await resolveComponent(componentInstance.kind, thread.componentResolvers)
  return {
    id,
    ...serializeComponent(component),
    state: 'IDLE',
    error: thread.nodes.get(id)?.error?.message,
    errorName: thread.nodes.get(id)?.error?.name,
    errorContext: thread.nodes.get(id)?.error?.context,
    label: componentInstance.meta?.label,
    comment: componentInstance.meta?.comment,
    position: componentInstance.meta?.position ?? { x: 0, y: 0 },
    input: componentInstance.input ?? {},
    output: {},
  }
}
