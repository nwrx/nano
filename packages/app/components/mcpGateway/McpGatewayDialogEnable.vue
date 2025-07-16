<script setup lang="ts">
import type { McpGatewayObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import McpGatewayCard from './McpGatewayCard.vue'

const props = defineProps<{
  gateway: McpGatewayObject
  manager: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()

// --- Submit.
async function enableGateway() {
  await client.requestAttempt('POST /api/mcp/:manager/gateways/:identity/enable', {
    data: {
      manager: props.manager,
      identity: props.gateway.identity,
    },
    onSuccess: () => {
      alerts.success(t('enableSuccess', { identity: props.gateway.identity }))
      emit('submit')
    },
  })
}

// --- State.
const isOpen = defineModel({ default: false })
const identity = computed(() => props.gateway.identity)
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:play"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('enableTitle', { identity })"
    :text="t('enableText', { identity })"
    :label-cancel="t('cancel')"
    :label-confirm="t('enableConfirm')"
    @confirm="() => enableGateway()">
    <McpGatewayCard :gateway />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  enableTitle: Enable gateway
  enableText: Enable gateway **{identity}** to allow it to accept and process MCP server connections.
  enableConfirm: Enable
  enableSuccess: Gateway **{identity}** has been enabled.
  cancel: Cancel
fr:
  enableTitle: Activer la passerelle
  enableText: Activer la passerelle **{identity}** pour lui permettre d'accepter et de traiter les connexions de serveur MCP.
  enableConfirm: Activer
  enableSuccess: La passerelle **{identity}** a été activée.
  cancel: Annuler
de:
  enableTitle: Gateway aktivieren
  enableText: Aktivieren Sie das Gateway **{identity}**, um ihm zu erlauben, MCP-Server-Verbindungen zu akzeptieren und zu verarbeiten.
  enableConfirm: Aktivieren
  enableSuccess: Gateway **{identity}** wurde aktiviert.
  cancel: Abbrechen
es:
  enableTitle: Habilitar puerta de enlace
  enableText: Habilitar la puerta de enlace **{identity}** para permitirle aceptar y procesar conexiones de servidor MCP.
  enableConfirm: Habilitar
  enableSuccess: La puerta de enlace **{identity}** ha sido habilitada.
  cancel: Cancelar
zh:
  enableTitle: 启用网关
  enableText: 启用网关 **{identity}** 以允许其接受和处理MCP服务器连接。
  enableConfirm: 启用
  enableSuccess: 网关 **{identity}** 已启用。
  cancel: 取消
</i18n>
