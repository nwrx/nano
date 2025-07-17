<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import { useMcpServer } from '~/composables/useMcp'
import McpServerCard from './McpServerCard.vue'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

// --- State.
const { t } = useI18n()
const server = useMcpServer(props)
const isOpen = defineModel({ default: false })
const confirm = ref('')
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:trash-can"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { pool, name })"
    :text="t('text', { pool, name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirm !== name"
    @confirm="() => server.removeServer()">

    <!-- Server card -->
    <McpServerCard
      v-if="isOpen"
      :workspace="workspace"
      :pool="pool"
      :name="name"
      class="mb-4"
    />

    <!-- Confirmation name field -->
    <InputText
      v-model="confirm"
      :label="t('label')"
      :placeholder="name"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Delete server **{pool}/{name}**
  text: Permanently remove server **{pool}/{name}** from your workspace. This action cannot be undone and will terminate all associated connections.
  label: Type the server name to confirm
  cancel: Cancel
  confirm: Delete Server
fr:
  title: Supprimer le serveur **{pool}/{name}**
  text: Supprimer définitivement le serveur **{pool}/{name}** de votre espace de travail. Cette action ne peut pas être annulée et terminera toutes les connexions associées.
  label: Tapez le nom du serveur pour confirmer
  cancel: Annuler
  confirm: Supprimer le Serveur
de:
  title: Server **{pool}/{name}** löschen
  text: Entfernen Sie den Server **{pool}/{name}** dauerhaft aus Ihrem Arbeitsbereich. Diese Aktion kann nicht rückgängig gemacht werden und beendet alle zugehörigen Verbindungen.
  label: Geben Sie den Servernamen zur Bestätigung ein
  cancel: Abbrechen
  confirm: Server Löschen
  success: Server **{pool}/{name}** wurde gelöscht.
es:
  title: Eliminar servidor **{pool}/{name}**
  text: Eliminar permanentemente el servidor **{pool}/{name}** de su espacio de trabajo. Esta acción no se puede deshacer y terminará todas las conexiones asociadas.
  label: Escriba el nombre del servidor para confirmar
  cancel: Cancelar
  confirm: Eliminar Servidor
  success: El servidor **{pool}/{name}** ha sido eliminado.
zh:
  title: 删除服务器 **{pool}/{name}**
  text: 从您的工作区中永久删除服务器 **{pool}/{name}**。此操作无法撤消，将终止所有相关连接。
  label: 输入服务器名称以确认
  cancel: 取消
  confirm: 删除服务器
  success: 服务器 **{pool}/{name}** 已被删除。
</i18n>
