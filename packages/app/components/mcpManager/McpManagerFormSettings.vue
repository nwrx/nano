<script setup lang="ts">
import type { McpManagerObject } from '@nwrx/nano-api'
import AppPageForm from '~/components/app/AppPageForm.vue'
import InputText from '~/components/base/InputText.vue'
import { CONSTANTS } from '~/utils/constants'

defineProps<{ manager: McpManagerObject }>()

const { t } = useI18n()
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <!-- Identity -->
    <InputText
      :model-value="manager.identity"
      :label="t('identity')"
      :text-before="`${CONSTANTS.appHost}/mcp/managers/`"
      :disabled="true"
    />

    <!-- Address -->
    <InputText
      :model-value="manager.address"
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
  text: Essential configuration details for this MCP manager. Each manager coordinates multiple gateways and provides centralized control over your MCP infrastructure.
  identity: Identity
  address: Address
  addressHint: The network endpoint where this MCP manager can be reached
  addressPlaceholder: Enter the manager address
fr:
  title: Configuration Générale
  text: Détails de configuration essentiels pour ce gestionnaire MCP. Chaque gestionnaire coordonne plusieurs passerelles et fournit un contrôle centralisé sur votre infrastructure MCP.
  identity: Identité
  address: Adresse
  addressHint: Le point de terminaison réseau où ce gestionnaire MCP peut être atteint
  addressPlaceholder: Entrez l'adresse du gestionnaire
de:
  title: Allgemeine Konfiguration
  text: Wesentliche Konfigurationsdetails für diesen MCP-Manager. Jeder Manager koordiniert mehrere Gateways und bietet zentrale Kontrolle über Ihre MCP-Infrastruktur.
  identity: Identität
  address: Adresse
  addressHint: Der Netzwerk-Endpunkt, unter dem dieser MCP-Manager erreichbar ist
  addressPlaceholder: Manager-Adresse eingeben
es:
  title: Configuración General
  text: Detalles de configuración esenciales para este administrador MCP. Cada administrador coordina múltiples puertas de enlace y proporciona control centralizado sobre su infraestructura MCP.
  identity: Identidad
  address: Dirección
  addressHint: El endpoint de red donde se puede alcanzar este administrador MCP
  addressPlaceholder: Ingrese la dirección del administrador
zh:
  title: 常规配置
  text: 此MCP管理器的基本配置详细信息。每个管理器协调多个网关，并为您的MCP基础设施提供集中控制。
  identity: 身份标识
  address: 地址
  addressHint: 可以访问此MCP管理器的网络端点
  addressPlaceholder: 输入管理器地址
</i18n>
