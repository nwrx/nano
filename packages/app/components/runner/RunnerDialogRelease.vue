<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'

const props = defineProps<{
  modelValue?: boolean
  runner: ThreadRunnerObject
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const confirmIdentity = ref('')

async function releaseRunner() {
  await client.request('DELETE /api/runners/:identity', {
    data: {
      identity: props.runner.identity,
    },
    onSuccess: () => {
      alerts.success(t('success', { identity: props.runner.identity }))
      emit('submit')
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => confirmIdentity.value = '', { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:trash-can"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { identity: runner.identity })"
    :text="t('text', { identity: runner.identity })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirmIdentity !== runner.identity"
    @confirm="() => releaseRunner()">
    <InputText
      v-model="confirmIdentity"
      :label="t('label')"
      :placeholder="runner.identity"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Release runner
  text: Permanently remove runner **{identity}** from the system. This action cannot be undone and will terminate any running threads.
  label: Type the runner identity to confirm
  cancel: Cancel
  confirm: Release
  success: Runner **{identity}** has been released.
fr:
  title: Libérer le serveur d'exécution
  text: Supprimer définitivement le serveur d'exécution **{identity}** du système. Cette action est irréversible et mettra fin à tous les threads en cours.
  label: Tapez l'identité du serveur d'exécution pour confirmer
  cancel: Annuler
  confirm: Libérer
  success: Le serveur d'exécution **{identity}** a été libéré.
de:
  title: Ausführungsserver freigeben
  text: Entfernen Sie den Ausführungsserver **{identity}** dauerhaft aus dem System. Diese Aktion kann nicht rückgängig gemacht werden und beendet alle laufenden Threads.
  label: Geben Sie die Ausführungsserver-Identität zur Bestätigung ein
  cancel: Abbrechen
  confirm: Freigeben
  success: Ausführungsserver **{identity}** wurde freigegeben.
es:
  title: Liberar el servidor de ejecución
  text: Eliminar permanentemente el servidor de ejecución **{identity}** del sistema. Esta acción no se puede deshacer y finalizará cualquier hilo en ejecución.
  label: Escribe la identidad del servidor de ejecución para confirmar
  cancel: Cancelar
  confirm: Liberar
  success: El servidor de ejecución **{identity}** ha sido liberado.
zh:
  title: 释放执行服务器
  text: 永久从系统中移除执行服务器 **{identity}**。此操作无法撤销，并将终止所有正在运行的线程。
  label: 输入执行服务器标识以确认
  cancel: 取消
  confirm: 释放
  success: 执行服务器 **{identity}** 已被释放。
</i18n>
