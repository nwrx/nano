<script setup lang="ts">
import type { McpPoolObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'

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
const confirmName = ref('')

async function deletePool() {
  await client.requestAttempt('DELETE /api/workspaces/:workspace/pools/:pool', {
    data: {
      workspace: props.workspace,
      pool: props.pool.name,
    },
    onSuccess: () => {
      alerts.success(t('success', { name: props.pool.name }))
      emit('submit')
    },
  })
}

// --- State.
const isOpen = defineModel({ default: false })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:trash-can"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { name: pool.name })"
    :text="t('text', { name: pool.name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirmName !== pool.name"
    @confirm="() => deletePool()">
    <InputText
      v-model="confirmName"
      :label="t('label')"
      :placeholder="pool.name"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Delete pool **{name}**
  text: Permanently remove pool **{name}** from your workspace. This action cannot be undone and will terminate all servers in the pool.
  label: Type the pool name to confirm
  cancel: Cancel
  confirm: Delete Pool
  success: Pool **{name}** has been deleted.
fr:
  title: Supprimer le pool **{name}**
  text: Supprimer définitivement le pool **{name}** de votre espace de travail. Cette action ne peut pas être annulée et terminera tous les serveurs du pool.
  label: Tapez le nom du pool pour confirmer
  cancel: Annuler
  confirm: Supprimer le Pool
  success: Le pool **{name}** a été supprimé.
de:
  title: Pool **{name}** löschen
  text: Entfernen Sie den Pool **{name}** dauerhaft aus Ihrem Arbeitsbereich. Diese Aktion kann nicht rückgängig gemacht werden und beendet alle Server im Pool.
  label: Geben Sie den Pool-Namen zur Bestätigung ein
  cancel: Abbrechen
  confirm: Pool Löschen
  success: Pool **{name}** wurde gelöscht.
es:
  title: Eliminar pool **{name}**
  text: Eliminar permanentemente el pool **{name}** de su espacio de trabajo. Esta acción no se puede deshacer y terminará todos los servidores en el pool.
  label: Escriba el nombre del pool para confirmar
  cancel: Cancelar
  confirm: Eliminar Pool
  success: El pool **{name}** ha sido eliminado.
zh:
  title: 删除池 **{name}**
  text: 从您的工作区中永久删除池 **{name}**。此操作无法撤消，将终止池中的所有服务器。
  label: 输入池名称以确认
  cancel: 取消
  confirm: 删除池
  success: 池 **{name}** 已被删除。
</i18n>
