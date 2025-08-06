import type { ProviderName } from '@nwrx/ai'
import type { Schema } from '../utils/defineComponent'
import * as PROVIDERS from '@nwrx/ai/providers'
import { defineComponent } from '../utils/defineComponent'

export const PROVIDER_SCHEMA = {
  type: 'object',
  properties: {
    name: {
      'type': 'string',
      'enum': Object.keys(PROVIDERS) as ProviderName[],
      'x-control': 'reference/provider',
    },
    options: {
      'type': 'object',
      'additionalProperties': true,
      'x-control': 'reference/provider-options',
    },
  },
} as const satisfies Schema

export const provider = defineComponent(
  {
    isTrusted: true,
    name: 'provider',
    purpose: 'integration',
    icon: 'carbon:foundation-model',
    title: {
      en: 'Provider',
      fr: 'Fournisseur',
      de: 'Anbieter',
      es: 'Proveedor',
      zh: '提供商',
    },
    description: {
      en: 'Configure AI service providers with authentication and options.',
      fr: 'Configurer les fournisseurs de services IA avec authentification et options.',
      de: 'KI-Service-Anbieter mit Authentifizierung und Optionen konfigurieren.',
      es: 'Configurar proveedores de servicios de IA con autenticación y opciones.',
      zh: '配置AI服务提供商的身份验证和选项。',
    },
    inputs: PROVIDER_SCHEMA.properties,
    outputs: { provider: PROVIDER_SCHEMA },
  },
  ({ data }) => ({ provider: data }),
)
