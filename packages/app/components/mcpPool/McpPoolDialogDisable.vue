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
    class-hint="hint-warning"
    class-button="button-warning"
    icon="i-carbon:pause"
    :title="t('title')"
    :text="t('text', { name })"
    :label-cancel="t('cancel')"
    :label-submit="t('disable')"
    @submit="() => pool.disablePool()">

    <!-- Pool Card -->
    <McpPoolCard
      :workspace="workspace"
      :name="name"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Disable Pool
  text: Are you sure you want to disable the pool **{name}**? This will prevent new servers from being started in this pool.
  cancel: Cancel
  disable: Disable Pool
fr:
  title: Désactiver le pool
  text: Êtes-vous sûr de vouloir désactiver le pool **{name}** ? Cela empêchera de nouveaux serveurs d'être démarrés dans ce pool.
  cancel: Annuler
  disable: Désactiver le pool
de:
  title: Pool deaktivieren
  text: Sind Sie sicher, dass Sie den Pool **{name}** deaktivieren möchten? Dies verhindert, dass neue Server in diesem Pool gestartet werden.
  cancel: Abbrechen
  disable: Pool deaktivieren
es:
  title: Deshabilitar pool
  text: ¿Está seguro de que desea deshabilitar el pool **{name}**? Esto impedirá que se inicien nuevos servidores en este pool.
  cancel: Cancelar
  disable: Deshabilitar pool
zh:
  title: 禁用池
  text: 您确定要禁用池 **{name}** 吗？这将阻止在此池中启动新服务器。
  cancel: 取消
  disable: 禁用池
</i18n>
