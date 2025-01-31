/* eslint-disable sonarjs/todo-tag */
import type { Flow, FlowNode, FlowNodeDefinition, FlowThreadNodeState, InputSchema, SocketControl, SocketListOption } from '@nwrx/core'
import type { MaybeLiteral } from '@unshared/types'
import type { Peer } from 'crossws'
import type { FlowSessionEventPayload, FlowSessionInstance } from './resolveFlowSession'
import { Core } from '@nwrx/module-core'

/**
 * The modules that can be used to build a flow.
 *
 * TODO: This should be dynamically loaded from module registry.
 */
const MODULES = [
  Core,
]

export interface FlowSessionParticipantJSON {
  id: string
  name: string
  color: string
  position: { x: number; y: number }
}

export interface FlowJSON {
  name: string
  icon: string
  description: string
  nodes: FlowThreadNodeJSON[]
  categories: FlowCategoryNodesJSON[]
  events: FlowSessionEventPayload[]
  secrets: string[]
  variables: string[]
  isRunning: boolean
  peerId: string
  peers: FlowSessionParticipantJSON[]
}

/** The serialized representation of a flow category. */
export interface FlowCategoryNodesJSON {
  kind: string
  name?: string
  icon?: string
  description?: string
  nodes: FlowNodeDefinitionJSON[]
}
export interface OutputSocketJSON {
  key: string
  name: string
  typeKind: string
  typeName?: string
  typeColor?: string
  typeDescription?: string
  description?: string
}

export interface InputSocketJSON extends OutputSocketJSON {
  control?: MaybeLiteral<SocketControl>
  options?: SocketListOption[]
  sliderMax?: number
  sliderMin?: number
  sliderStep?: number
  defaultValue?: unknown
  isOptional?: boolean
  isIterable?: boolean
}

export interface FlowNodeDefinitionJSON {
  kind: string
  name: string
  icon: string
  categoryKind: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
  categoryDescription: string
  description: string
  inputSchema: InputSocketJSON[]
  outputSchema: OutputSocketJSON[]
}

export interface FlowThreadNodeJSON extends FlowNodeDefinitionJSON {
  id: string
  state: FlowThreadNodeState
  error?: string
  label?: string
  comment?: string
  position: { x: number; y: number }
  input: Record<string, unknown>
  inputErrors: Record<string, string>
  output: Record<string, unknown>
  outputErrors: Record<string, string>
}

export function serializeCategories() {
  const categories: FlowCategoryNodesJSON[] = [{
    kind: 'uncategorized',
    name: 'Uncategorized',
    icon: 'https://api.iconify.design/carbon:unknown.svg',
    description: 'Uncategorized nodes',
    nodes: [],
  }]

  // --- Collect all the categories from the module nodes.
  for (const module of MODULES) {
    if (!module.nodes) continue
    for (const key in module.nodes) {
      const node = module.nodes[key]
      const nodeJson = serializeNodeDefinition(node as FlowNodeDefinition)

      // --- If the node has no category, add it to the uncategorized category.
      if (!nodeJson.categoryKind) {
        categories[0].nodes.push(nodeJson)
        continue
      }

      // --- If the category already exists, add the node to the category.
      // --- Otherwise, create a new category and add the node to the category.
      const category = categories.find(c => c.kind === nodeJson.categoryKind)
      if (category) { category.nodes.push(nodeJson) }
      else {
        categories.push({
          kind: nodeJson.categoryKind,
          name: nodeJson.categoryName,
          icon: nodeJson.categoryIcon,
          description: nodeJson.categoryDescription,
          nodes: [nodeJson],
        })
      }
    }
  }

  // --- Sort the categories by their kind.
  return categories
    .filter(c => c.nodes.length > 0)
    .sort((a, b) => a.kind.localeCompare(b.kind))
}

export function serializeNodeInputSchema(schema?: unknown): InputSocketJSON[] {
  if (!schema) return []
  return Object
    .entries(schema as InputSchema)
    .filter(([, socket]) => !socket.isInternal)
    .map(([key, socket]) => ({
      key,
      name: socket.name ?? key,
      typeKind: socket.type?.kind,
      typeName: socket.type?.name,
      typeColor: socket.type?.color,
      typeDescription: socket.type?.description,
      control: socket.control,
      description: socket.description,
      options: typeof socket.options === 'function' ? undefined : socket.options,
      sliderMax: socket.sliderMax,
      sliderMin: socket.sliderMin,
      sliderStep: socket.sliderStep,
      defaultValue: socket.defaultValue,
      isOptional: socket.isOptional,
      isIterable: socket.isIterable,
    }))
}

export function serializeNodeOutputSchema(schema?: InputSchema): OutputSocketJSON[] {
  if (!schema) return []
  return Object
    .entries(schema)
    .map(([key, socket]) => ({
      key,
      name: socket.name ?? key,
      typeKind: socket.type?.kind,
      typeName: socket.type?.name,
      typeColor: socket.type?.color,
      typeDescription: socket.type?.description,
      description: socket.description,
    }))
}

export function serializeNodeDefinition(node: FlowNodeDefinition): FlowNodeDefinitionJSON {
  return {
    kind: node.kind,
    icon: node.icon ?? 'https://api.iconify.design/carbon:unknown.svg',
    name: node.name ?? node.kind,
    description: node.description ?? 'No description available.',
    categoryKind: node.category?.kind ?? 'uncategorized',
    categoryName: node.category?.name ?? 'Uncategorized',
    categoryIcon: node.category?.icon ?? 'https://api.iconify.design/carbon:unknown.svg',
    categoryColor: node.category?.color ?? '#000000',
    categoryDescription: node.category?.description ?? 'No description available.',
    inputSchema: serializeNodeInputSchema(node.inputSchema),
    outputSchema: serializeNodeOutputSchema(node.outputSchema),
  }
}

export async function serializeNode(flow: Flow, node: FlowNode): Promise<FlowThreadNodeJSON> {
  const definition = await flow.describe(node.kind)
  return {
    ...serializeNodeDefinition(definition),
    id: node.id,
    state: 'IDLE',
    error: undefined,
    label: node.meta?.label,
    comment: node.meta?.comment,
    position: node.meta?.position ?? { x: 0, y: 0 },
    input: node.input ?? {},
    output: {},
    inputErrors: {},
    outputErrors: {},
    // dataParseErrors: mapValues(node.dataParseErrors, error => error.message),
    // resultParseErrors: mapValues(node.resultParseErrors, error => error.message),
  }
}

export async function serializeFlowSession(session: FlowSessionInstance, peer: Peer): Promise<FlowJSON> {
  const nodePromises = session.flow.nodes.values().map(node => serializeNode(session.flow, node))
  const nodes = await Promise.all(nodePromises)
  return {
    name: session.entity.name ?? 'Untitled Flow',
    icon: 'i-carbon:flow',
    description: session.entity.description ?? '',
    nodes,
    categories: serializeCategories(),
    isRunning: session.thread.isRunning,
    events: [],
    secrets: session.entity.project?.secrets?.map(secret => secret.name) ?? [],
    variables: session.entity.project?.variables?.map(variable => variable.name) ?? [],
    peerId: peer.id,
    peers: session.participants.map(peer => ({
      id: peer.peer.id,
      name: peer.peer.id,
      color: peer.color,
      position: peer.position,
    })),
  }
}
