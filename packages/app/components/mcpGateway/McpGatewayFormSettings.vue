<script setup lang="ts">
import type { McpGatewayObject } from '@nwrx/nano-api'
import InputText from '~/components/base/InputText.vue'
import { CONSTANTS } from '../../utils/constants'
import AppPageForm from '../app/AppPageForm.vue'

defineProps<{
  gateway: McpGatewayObject
  manager: string
}>()

const { t } = useI18n()
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <!-- Identity -->
    <InputText
      :model-value="gateway.identity"
      :label="t('identity')"
      :text-before="`${CONSTANTS.appHost}/mcp/gateways/`"
      :disabled="true"
    />

    <!-- Address -->
    <InputText
      :model-value="gateway.address"
      :label="t('address')"
      :hint="t('addressHint')"
      :placeholder="t('addressPlaceholder')"
      :disabled="true"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: General Configuration
  text: Essential configuration details for this MCP gateway. Each gateway handles specific protocol routing and serves as an entry point for MCP communications.
  identity: Identity
  address: Address
  addressHint: The network endpoint where this MCP gateway can be reached
  addressPlaceholder: Enter the gateway address
  manager: Manager
  managerHint: The MCP manager that coordinates this gateway
fr:
  title: Configuration Générale
  text: Détails de configuration essentiels pour cette passerelle MCP. Chaque passerelle gère le routage de protocoles spécifiques et sert de point d'entrée pour les communications MCP.
  identity: Identité
  address: Adresse
  addressHint: Le point de terminaison réseau où cette passerelle MCP peut être atteinte
  addressPlaceholder: Entrez l'adresse de la passerelle
  manager: Gestionnaire
  managerHint: Le gestionnaire MCP qui coordonne cette passerelle
de:
  title: Allgemeine Konfiguration
  text: Wesentliche Konfigurationsdetails für dieses MCP-Gateway. Jedes Gateway verwaltet spezifisches Protokoll-Routing und dient als Einstiegspunkt für MCP-Kommunikation.
  identity: Identität
  address: Adresse
  addressHint: Der Netzwerk-Endpunkt, unter dem dieses MCP-Gateway erreichbar ist
  addressPlaceholder: Gateway-Adresse eingeben
  manager: Manager
  managerHint: Der MCP-Manager, der dieses Gateway koordiniert
es:
  title: Configuración General
  text: Detalles de configuración esenciales para esta puerta de enlace MCP. Cada puerta de enlace maneja el enrutamiento de protocolos específicos y sirve como punto de entrada para las comunicaciones MCP.
  identity: Identidad
  address: Dirección
  addressHint: El endpoint de red donde se puede alcanzar esta puerta de enlace MCP
  addressPlaceholder: Ingrese la dirección de la puerta de enlace
  manager: Administrador
  managerHint: El administrador MCP que coordina esta puerta de enlace
zh:
  title: 常规配置
  text: 此MCP网关的基本配置详细信息。每个网关处理特定的协议路由，并作为MCP通信的入口点。
  identity: 身份标识
  address: 地址
  addressHint: 可以访问此MCP网关的网络端点
  addressPlaceholder: 输入网关地址
  manager: 管理器
  managerHint: 协调此网关的MCP管理器
</i18n>
