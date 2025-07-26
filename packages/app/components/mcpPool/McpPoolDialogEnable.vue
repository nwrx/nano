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
    class-hint="hint-success"
    class-button="button-success"
    icon="i-carbon:play"
    :title="t('title')"
    :text="t('text', { name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('enable')"
    @confirm="() => pool.enablePool()">

    <!-- Pool Card -->
    <McpPoolCard
      :workspace="workspace"
      :name="name"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Enable Pool
  text: Are you sure you want to enable the pool **{name}**? This will allow servers in this pool to be started and accept connections.
  cancel: Cancel
  enable: Enable Pool
fr:
  title: Activer le pool
  text: Êtes-vous sûr de vouloir activer le pool **{name}** ? Cela permettra aux serveurs de ce pool d'être démarrés et d'accepter des connexions.
  cancel: Annuler
  enable: Activer le pool
de:
  title: Pool aktivieren
  text: Sind Sie sicher, dass Sie den Pool **{name}** aktivieren möchten? Dies ermöglicht es Servern in diesem Pool, gestartet zu werden und Verbindungen zu akzeptieren.
  cancel: Abbrechen
  enable: Pool aktivieren
es:
  title: Habilitar pool
  text: ¿Está seguro de que desea habilitar el pool **{name}**? Esto permitirá que los servidores en este pool se inicien y acepten conexiones.
  cancel: Cancelar
  enable: Habilitar pool
zh:
  title: 启用池
  text: 您确定要启用池 **{name}** 吗？这将允许此池中的服务器启动并接受连接。
  cancel: 取消
  enable: 启用池
</i18n>
