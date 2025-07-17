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
    icon="i-carbon:play"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('title', { pool, name })"
    :text="t('text', { pool, name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => server.enableServer()">

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
  title: Enable server **{pool}/{name}**
  text: Activate server **{pool}/{name}** to accept new connections and process requests. The server will become available for use.
  cancel: Cancel
  confirm: Enable Server
fr:
  title: Activer le serveur **{pool}/{name}**
  text: Activer le serveur **{pool}/{name}** pour accepter de nouvelles connexions et traiter les demandes. Le serveur deviendra disponible pour utilisation.
  cancel: Annuler
  confirm: Activer le Serveur
de:
  title: Server **{pool}/{name}** aktivieren
  text: Aktivieren Sie den Server **{pool}/{name}**, um neue Verbindungen zu akzeptieren und Anfragen zu verarbeiten. Der Server wird zur Nutzung verfügbar.
  cancel: Abbrechen
  confirm: Server Aktivieren
es:
  title: Habilitar servidor **{pool}/{name}**
  text: Activar servidor **{pool}/{name}** para aceptar nuevas conexiones y procesar solicitudes. El servidor estará disponible para su uso.
  cancel: Cancelar
  confirm: Habilitar Servidor
zh:
  title: 启用服务器 **{pool}/{name}**
  text: 激活服务器 **{pool}/{name}** 以接受新连接并处理请求。服务器将可供使用。
  cancel: 取消
  confirm: 启用服务器
</i18n>
