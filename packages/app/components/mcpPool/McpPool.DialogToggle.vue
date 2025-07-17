<script setup lang="ts">
import type { McpPoolObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'

const props = defineProps<{
  pool: McpPoolObject
  workspace: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()

async function enablePool() {
  await client.requestAttempt('PUT /api/workspaces/:workspace/pools/:pool/enable', {
    data: {
      workspace: props.workspace,
      pool: props.pool.name,
    },
    onSuccess: () => {
      alerts.success(t('enableSuccess', { name: props.pool.name }))
      emit('submit')
    },
  })
}

async function disablePool() {
  await client.requestAttempt('PUT /api/workspaces/:workspace/pools/:pool/disable', {
    data: {
      workspace: props.workspace,
      pool: props.pool.name,
    },
    onSuccess: () => {
      alerts.success(t('disableSuccess', { name: props.pool.name }))
      emit('submit')
    },
  })
}

// --- State.
const isOpen = defineModel({ default: false })
const isDisabled = computed(() => props.pool.deletedAt)
const name = computed(() => props.pool.name)
</script>

<template>
  <Dialog
    v-model="isOpen"
    :icon="isDisabled ? 'i-carbon:play' : 'i-carbon:pause'"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="isDisabled ? t('enableTitle', { name }) : t('disableTitle', { name })"
    :text="isDisabled ? t('enableText', { name }) : t('disableText', { name })"
    :label-cancel="t('cancel')"
    :label-confirm="isDisabled ? t('enableConfirm') : t('disableConfirm')"
    @confirm="() => isDisabled ? enablePool() : disablePool()">
    <div class="p-md bg-subtle rd">
      <h4 class="text-lg font-semibold mb-sm">
        {{ pool.title || pool.name }}
      </h4>
      <p class="text-sm text-subtle">
        {{ pool.description }}
      </p>
      <div class="flex items-center gap-sm mt-sm">
        <span v-if="isDisabled" class="text-xs px-sm py-xs rd bg-danger text-white">Disabled</span>
        <span v-else class="text-xs px-sm py-xs rd bg-success text-white">Enabled</span>
      </div>
    </div>
  </Dialog>
</template>

<i18n lang="yaml">
en:
  enableTitle: Enable pool **{name}**
  enableText: Activate pool **{name}** to allow new servers to be created and managed within this pool.
  enableConfirm: Enable
  enableSuccess: Pool **{name}** has been enabled.
  disableTitle: Disable pool **{name}**
  disableText: Disable pool **{name}** to prevent new servers from being created. Existing servers will continue to run until completion.
  disableConfirm: Disable
  disableSuccess: Pool **{name}** has been disabled.
  cancel: Cancel
fr:
  enableTitle: Activer le pool **{name}**
  enableText: Activer le pool **{name}** pour permettre la création et la gestion de nouveaux serveurs dans ce pool.
  enableConfirm: Activer
  enableSuccess: Le pool **{name}** a été activé.
  disableTitle: Désactiver le pool **{name}**
  disableText: Désactiver le pool **{name}** pour empêcher la création de nouveaux serveurs. Les serveurs existants continueront à fonctionner jusqu'à leur achèvement.
  disableConfirm: Désactiver
  disableSuccess: Le pool **{name}** a été désactivé.
  cancel: Annuler
de:
  enableTitle: Pool **{name}** aktivieren
  enableText: Aktivieren Sie den Pool **{name}**, um die Erstellung und Verwaltung neuer Server in diesem Pool zu ermöglichen.
  enableConfirm: Aktivieren
  enableSuccess: Pool **{name}** wurde aktiviert.
  disableTitle: Pool **{name}** deaktivieren
  disableText: Deaktivieren Sie den Pool **{name}**, um die Erstellung neuer Server zu verhindern. Bestehende Server werden bis zum Abschluss weiterlaufen.
  disableConfirm: Deaktivieren
  disableSuccess: Pool **{name}** wurde deaktiviert.
  cancel: Abbrechen
es:
  enableTitle: Habilitar pool **{name}**
  enableText: Habilitar el pool **{name}** para permitir que se creen y gestionen nuevos servidores en este pool.
  enableConfirm: Habilitar
  enableSuccess: El pool **{name}** ha sido habilitado.
  disableTitle: Deshabilitar pool **{name}**
  disableText: Deshabilitar el pool **{name}** para prevenir que se creen nuevos servidores. Los servidores existentes continuarán ejecutándose hasta su finalización.
  disableConfirm: Deshabilitar
  disableSuccess: El pool **{name}** ha sido deshabilitado.
  cancel: Cancelar
zh:
  enableTitle: 启用池 **{name}**
  enableText: 激活池 **{name}** 以允许在此池中创建和管理新服务器。
  enableConfirm: 启用
  enableSuccess: 池 **{name}** 已启用。
  disableTitle: 禁用池 **{name}**
  disableText: 禁用池 **{name}** 以防止创建新服务器。现有服务器将继续运行直到完成。
  disableConfirm: 禁用
  disableSuccess: 池 **{name}** 已禁用。
  cancel: 取消
</i18n>
