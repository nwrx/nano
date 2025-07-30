<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import UserSearch from '~/components/user/UserSearch.vue'

defineProps<{
  workspace: string
  project: string
}>()

const { t } = useI18n()
const alerts = useAlerts()
const selectedUsers = ref<string>()
const isOpen = defineModel({ default: false })
watch(isOpen, () => selectedUsers.value = undefined)
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:status-change"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { workspace, project })"
    :text="t('text', { workspace, project })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="!selectedUsers"
    @confirm="() => alerts.error('Not implemented yet')">
    <UserSearch
      v-model="selectedUsers"
      class="mt-2"
      :multiple="true"
      :placeholder="t('userLabel')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Transfer project **{workspace}/{project}**
  text: Transferring ownership will move the project to another workspace. Ensure the new owner is prepared for this change.
  cancel: Cancel
  confirm: Transfer
  userLabel: Search and select new owner
  success: Project **{workspace}/{project}** has been transferred to **{newWorkspace}**
fr:
  title: Transférer le projet **{workspace}/{project}**
  text: Le transfert de propriété déplacera le projet vers un autre espace de travail. Assurez-vous que le nouveau propriétaire est prêt pour ce changement.
  cancel: Annuler
  confirm: Transférer
  userLabel: Rechercher et sélectionner le nouveau propriétaire
  success: Le projet **{workspace}/{project}** a été transféré vers **{newWorkspace}**
de:
  title: Projekt **{workspace}/{project}** übertragen
  text: Die Übertragung des Eigentums verschiebt das Projekt in einen anderen Arbeitsbereich. Stellen Sie sicher, dass der neue Eigentümer auf diese Änderung vorbereitet ist.
  cancel: Abbrechen
  confirm: Übertragen
  userLabel: Neuen Eigentümer suchen und auswählen
  success: Projekt **{workspace}/{project}** wurde an **{newWorkspace}** übertragen
es:
  title: Transferir proyecto **{workspace}/{project}**
  text: La transferencia de propiedad moverá el proyecto a otro espacio de trabajo. Asegúrese de que el nuevo propietario esté preparado para este cambio.
  cancel: Cancelar
  confirm: Transferir
  userLabel: Buscar y seleccionar nuevo propietario
  success: El proyecto **{workspace}/{project}** ha sido transferido a **{newWorkspace}**
zh:
  title: 转移项目 **{workspace}/{project}**
  text: 转移所有权将把项目移动到另一个工作区。请确保新所有者已准备好接受此更改。
  cancel: 取消
  confirm: 转移
  userLabel: 搜索并选择新所有者
  success: 项目 **{workspace}/{project}** 已被转移到 **{newWorkspace}**
</i18n>
