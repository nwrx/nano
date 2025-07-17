<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import { useMcpServer } from '~/composables/useMcp'
import McpServerCard from './McpServerCard.vue'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

// --- State.
const { t } = useI18n()
const isOpen = defineModel({ default: false })
const server = useMcpServer(props)
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:pause"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { pool, name })"
    :text="t('text', { pool, name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => server.disableServer()">

    <!-- Server card -->
    <McpServerCard
      v-if="isOpen"
      :workspace="workspace"
      :pool="pool"
      :name="name"
      class="mb-4"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Disable server **{pool}/{name}**
  text: Temporarily deactivate server **{pool}/{name}** to prevent new connections. Active sessions will continue but no new requests will be accepted.
  cancel: Cancel
  confirm: Disable Server
fr:
  title: Désactiver le serveur **{pool}/{name}**
  text: Désactiver temporairement le serveur **{pool}/{name}** pour empêcher de nouvelles connexions. Les sessions actives continueront mais aucune nouvelle demande ne sera acceptée.
  cancel: Annuler
  confirm: Désactiver le Serveur
de:
  title: Server **{pool}/{name}** deaktivieren
  text: Deaktivieren Sie den Server **{pool}/{name}** vorübergehend, um neue Verbindungen zu verhindern. Aktive Sitzungen werden fortgesetzt, aber keine neuen Anfragen werden akzeptiert.
  cancel: Abbrechen
  confirm: Server Deaktivieren
es:
  title: Deshabilitar servidor **{pool}/{name}**
  text: Desactivar temporalmente el servidor **{pool}/{name}** para prevenir nuevas conexiones. Las sesiones activas continuarán pero no se aceptarán nuevas solicitudes.
  cancel: Cancelar
  confirm: Deshabilitar Servidor
zh:
  title: 禁用服务器 **{pool}/{name}**
  text: 临时停用服务器 **{pool}/{name}** 以防止新连接。活动会话将继续，但不会接受新请求。
  cancel: 取消
  confirm: 禁用服务器
</i18n>
