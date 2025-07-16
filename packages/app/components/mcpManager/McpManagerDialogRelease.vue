<script setup lang="ts">
import type { McpManagerObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'

const props = defineProps<{
  manager: McpManagerObject
}>()

const emit = defineEmits<{
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const confirmIdentity = ref('')

// --- Submit.
async function releaseManager() {
  await client.requestAttempt('DELETE /api/mcp/:identity', {
    data: {
      identity: props.manager.identity,
    },
    onSuccess: () => {
      alerts.success(t('success', { identity: props.manager.identity }))
      emit('submit')
    },
  })
}

// --- State.
const isOpen = defineModel({ default: false })
watch(isOpen, () => confirmIdentity.value = '', { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:trash-can"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { identity: manager.identity })"
    :text="t('text', { identity: manager.identity })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirmIdentity !== manager.identity"
    @confirm="() => releaseManager()">

    <!-- Confirm -->
    <InputText
      v-model="confirmIdentity"
      :label="t('label')"
      :placeholder="manager.identity"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Release manager
  text: Permanently remove manager **{identity}** from the system. This action cannot be undone and will terminate all associated gateways.
  label: Type the manager identity to confirm
  cancel: Cancel
  confirm: Release
  success: Manager **{identity}** has been released.
fr:
  title: Libérer le gestionnaire
  text: Supprimer définitivement le gestionnaire **{identity}** du système. Cette action est irréversible et mettra fin à toutes les passerelles associées.
  label: Tapez l'identité du gestionnaire pour confirmer
  cancel: Annuler
  confirm: Libérer
  success: Le gestionnaire **{identity}** a été libéré.
de:
  title: Manager freigeben
  text: Entfernen Sie den Manager **{identity}** dauerhaft aus dem System. Diese Aktion kann nicht rückgängig gemacht werden und beendet alle zugehörigen Gateways.
  label: Geben Sie die Manager-Identität zur Bestätigung ein
  cancel: Abbrechen
  confirm: Freigeben
  success: Manager **{identity}** wurde freigegeben.
es:
  title: Liberar administrador
  text: Eliminar permanentemente el administrador **{identity}** del sistema. Esta acción no se puede deshacer y finalizará todas las puertas de enlace asociadas.
  label: Escribe la identidad del administrador para confirmar
  cancel: Cancelar
  confirm: Liberar
  success: El administrador **{identity}** ha sido liberado.
zh:
  title: 释放管理器
  text: 永久从系统中移除管理器 **{identity}**。此操作无法撤销，并将终止所有关联的网关。
  label: 输入管理器标识以确认
  cancel: 取消
  confirm: 释放
  success: 管理器 **{identity}** 已被释放。
</i18n>
