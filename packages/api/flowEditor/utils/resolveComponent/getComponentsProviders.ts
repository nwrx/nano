import type { Provider } from '@nwrx/ai'
import type { Schema } from '@nwrx/nano/utils'
import * as PROVIDERS from '@nwrx/ai/providers'
import { provider as providerComponent } from '@nwrx/nano/components'
import { once } from '@unshared/functions/once'
import { toTitleCase } from '@unshared/string/toTitleCase'

function createComponentsModelProviders(): FlowEditorComponentGroup[] {
  const components: FlowEditorComponent[] = []
  for (const name in PROVIDERS) {
    const provider = PROVIDERS[name as keyof typeof PROVIDERS] as Provider
    const parameterEntries = Object.entries(provider.parameters ?? {})
    const propertiesEntries = parameterEntries.map(([key, parameter]) => [key, parameter.schema])
    const properties = Object.fromEntries(propertiesEntries) as Record<string, Schema>
    components.push({
      name: 'provider',
      title: toTitleCase(provider.name),
      version: '0.0.0',
      inputs: {
        name: {
          'type': 'string',
          'x-hidden': true,
        },
        options: {
          'type': 'object',
          'additionalProperties': true,
          'properties': properties,
          'x-control': 'table',
        },
      },
      outputs: providerComponent.outputs as Record<string, Schema>,
      defaultInputs: { name: provider.name },
      defaultMetadata: { label: toTitleCase(provider.name) },
    })
  }
  return [{ name: 'models', components, groups: [] }]
}

/**
 * Get the model provider components for the flow editor.
 * This function creates components for each provider available in the @nwrx/ai package.
 *
 * @returns An array of component groups, each containing model provider components.
 */
export const getComponentsModelProviders = once(createComponentsModelProviders)
