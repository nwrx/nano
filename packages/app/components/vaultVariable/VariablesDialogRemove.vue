<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import VariableCard from './VariableCard.vue'

const props = defineProps<{
  workspace: string
  variable: string
  vault: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

// --- State.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const isOpen = defineModel<boolean>({ default: false })

// --- Methods.
async function removeVariable() {
  await client.requestAttempt(
    'DELETE /workspaces/:workspace/vaults/:vault/variables/:variable',
    {
      data: {
        workspace: props.workspace,
        variable: props.variable,
        vault: props.vault,
      },
      onSuccess: () => {
        emit('submit')
        alerts.success(t('success'))
      },
    },
  )
}
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:delete"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { ...props })"
    :text="t('text', { ...props })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => removeVariable()">

    <!-- Variable Card -->
    <VariableCard
      :variable="variable"
      :vault="vault"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Remove variable **{workspace}/{vault}/{variable}**
  text: Are you sure you want to delete this variable? This action cannot be undone.
  cancel: Cancel
  confirm: Delete variable
  success: Variable deleted successfully
fr:
  title: Supprimer la variable **{workspace}/{vault}/{variable}**
  text: Êtes-vous sûr de vouloir supprimer cette variable ? Cette action ne peut pas être annulée.
  cancel: Annuler
  confirm: Supprimer la variable
  success: Variable supprimée avec succès
de:
  title: Variable **{workspace}/{vault}/{variable}** entfernen
  text: Sind Sie sicher, dass Sie diese Variable löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
  cancel: Abbrechen
  confirm: Variable löschen
  success: Variable erfolgreich gelöscht
es:
  title: Eliminar variable **{workspace}/{vault}/{variable}**
  text: ¿Está seguro de que desea eliminar esta variable? Esta acción no se puede deshacer.
  cancel: Cancelar
  confirm: Eliminar variable
  success: Variable eliminada con éxito
zh:
  title: 删除变量 **{workspace}/{vault}/{variable}**
  text: 您确定要删除此变量吗？此操作无法撤消。
  cancel: 取消
  confirm: 删除变量
  success: 变量已成功删除
</i18n>
