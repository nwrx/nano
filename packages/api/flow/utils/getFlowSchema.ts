import type { Component } from '@nwrx/nano/utils'
import type { FlowSchema } from './types'
import { parseSpecifier, serializeSpecifier } from '@nwrx/nano/utils'
import { createParser } from '@unshared/validation'
import { assertProject } from '../../project'
import { assertWorkspace } from '../../workspace'
import { assertFlow } from './assertFlow'
import { resolveComponent } from './resolveComponent'

/** The schema for the options of the {@linkcode getFlowSchema} function. */
export const GET_FLOW_SCHEMA_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  project: assertProject,
  flow: assertFlow,
})

/** The options for the {@linkcode getFlowSchema} function. */
export type GetFlowSchemaOptions = ReturnType<typeof GET_FLOW_SCHEMA_OPTIONS_SCHEMA>

/**
 * Retrieves the schema of a flow, including its inputs, outputs, and nodes.
 *
 * @param options The options for retrieving the flow schema.
 * @returns A promise that resolves to the flow schema.
 */
export async function getFlowSchema(options: GetFlowSchemaOptions): Promise<FlowSchema> {
  const { flow } = options

  // --- Get inputs, outputs, and nodes in a single iteration
  const threadSchema: FlowSchema = {
    title: flow.title,
    description: flow.description,
    inputs: [],
    outputs: [],
    nodes: [],
  }

  // --- Resolve all components used in the flow.
  const nodeComponentSpecifiers = Object.values(flow.data.nodes).map((node) => {
    const specifierObject = parseSpecifier(node.component)
    return serializeSpecifier(specifierObject)
  })

  const nodeComponentsMap = new Map<string, Component>()
  await Promise.all([...new Set(nodeComponentSpecifiers)]
    .map(async(specifier) => {
      const specifierObject = parseSpecifier(specifier)
      const component = await resolveComponent(specifierObject)
      if (!component) return
      nodeComponentsMap.set(specifier, component)
    }))

  for (const [id, node] of Object.entries(flow.data.nodes)) {
    const specifierObject = parseSpecifier(node.component)
    const isCoreComponent = specifierObject.registry === 'default'
      && specifierObject.workspace === 'default'
      && specifierObject.collection === 'default'
      && specifierObject.tag === 'latest'

    // Process inputs
    if (isCoreComponent && specifierObject.name === 'input') {
      threadSchema.inputs.push({
        id,
        type: 'string',
        name: node.name as string,
        label: node.name as string,
        description: node.description as string | undefined,
        required: false,
      })
    }

    // Process outputs
    if (isCoreComponent && specifierObject.name === 'output') {
      threadSchema.outputs.push({
        id,
        type: 'string',
        name: node.name as string,
        title: node.name as string,
        description: node.description as string | undefined,
      })
    }

    // Process all nodes
    const specifierString = serializeSpecifier(specifierObject)
    const component = nodeComponentsMap.get(specifierString)
    threadSchema.nodes.push({
      id,
      icon: component?.icon ?? 'carbon:help',
      title: component?.title ?? specifierString,
      purpose: component?.purpose ?? 'other',
      specifier: specifierString,
    })
  }

  // --- Return the flow schema
  return threadSchema
}
