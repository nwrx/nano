import type { ProviderName } from '@nwrx/ai'
import type { Schema } from '../utils/defineComponent'
import * as PROVIDERS from '@nwrx/ai/providers'
import { defineComponent } from '../utils/defineComponent'

export const PROVIDER_SCHEMA = {
  type: 'object',
  properties: {
    name: {
      'type': 'string',
      'title': 'Provider',
      'description': 'The provider to use for inference.',
      'x-control': 'select',
      'enum': Object.keys(PROVIDERS) as ProviderName[],
    },
    options: {
      type: 'object',
      title: 'Options',
      description: 'The options for the provider.',
      additionalProperties: true,
    },
  },
} as const satisfies Schema

export const provider = defineComponent(
  {
    isTrusted: true,
    inputs: PROVIDER_SCHEMA.properties,
    outputs: { provider: PROVIDER_SCHEMA },
  },
  ({ data }) => ({ provider: data }),
)
