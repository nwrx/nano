<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import { useMcpPool } from '~/composables/useMcp'
import McpPoolCard from './McpPoolCard.vue'

const props = defineProps<{
  workspace: string
  name: string
}>()

// --- State.
const { t } = useI18n()
const pool = useMcpPool(props)
const isOpen = defineModel({ default: false })
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-hint="hint-danger"
    class-button="button-danger"
    icon="i-carbon:trash-can"
    :title="t('title')"
    :text="t('text', { name })"
    :label-cancel="t('cancel')"
    :label-submit="t('delete')"
    @confirm="() => pool.removePool()">

    <!-- Pool Card -->
    <McpPoolCard
      :workspace="workspace"
      :name="name"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Delete Pool
  text: Are you sure you want to delete the pool **{name}**? This action cannot be undone and will remove all associated servers.
  cancel: Cancel
  delete: Delete Pool
fr:
  title: Supprimer le pool
  text: Êtes-vous sûr de vouloir supprimer le pool **{name}** ? Cette action ne peut pas être annulée et supprimera tous les serveurs associés.
  cancel: Annuler
  delete: Supprimer le pool
de:
  title: Pool löschen
  text: Sind Sie sicher, dass Sie den Pool **{name}** löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden und entfernt alle zugehörigen Server.
  cancel: Abbrechen
  delete: Pool löschen
es:
  title: Eliminar pool
  text: ¿Está seguro de que desea eliminar el pool **{name}**? Esta acción no se puede deshacer y eliminará todos los servidores asociados.
  cancel: Cancelar
  delete: Eliminar pool
zh:
  title: 删除池
  text: 您确定要删除池 **{name}** 吗？此操作无法撤消，并将删除所有关联的服务器。
  cancel: 取消
  delete: 删除池
</i18n>
