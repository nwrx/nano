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
async function disableGateway() {
  await client.requestAttempt('POST /api/mcp/:manager/gateways/:identity/disable', {
    data: {
      manager: props.manager,
      identity: props.gateway.identity,
    },
    onSuccess: () => {
      alerts.success(t('disableSuccess', { identity: props.gateway.identity }))
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
    icon="i-carbon:pause"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('disableTitle', { identity })"
    :text="t('disableText', { identity })"
    :label-cancel="t('cancel')"
    :label-confirm="t('disableConfirm')"
    @confirm="() => disableGateway()">
    <McpGatewayCard :gateway />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  disableTitle: Disable gateway
  disableText: Disable gateway **{identity}** to prevent new server connections. Active connections will continue to operate.
  disableConfirm: Disable
  disableSuccess: Gateway **{identity}** has been disabled.
  cancel: Cancel
fr:
  disableTitle: Désactiver la passerelle
  disableText: Désactiver la passerelle **{identity}** pour empêcher de nouvelles connexions de serveur. Les connexions actives continueront à fonctionner.
  disableConfirm: Désactiver
  disableSuccess: La passerelle **{identity}** a été désactivée.
  cancel: Annuler
de:
  disableTitle: Gateway deaktivieren
  disableText: Deaktivieren Sie das Gateway **{identity}**, um neue Server-Verbindungen zu verhindern. Aktive Verbindungen werden weiterhin funktionieren.
  disableConfirm: Deaktivieren
  disableSuccess: Gateway **{identity}** wurde deaktiviert.
  cancel: Abbrechen
es:
  disableTitle: Deshabilitar puerta de enlace
  disableText: Deshabilitar la puerta de enlace **{identity}** para evitar nuevas conexiones de servidor. Las conexiones activas continuarán operando.
  disableConfirm: Deshabilitar
  disableSuccess: La puerta de enlace **{identity}** ha sido deshabilitada.
  cancel: Cancelar
zh:
  disableTitle: 禁用网关
  disableText: 禁用网关 **{identity}** 以防止新的服务器连接。活动连接将继续运行。
  disableConfirm: 禁用
  disableSuccess: 网关 **{identity}** 已禁用。
  cancel: 取消
</i18n>
