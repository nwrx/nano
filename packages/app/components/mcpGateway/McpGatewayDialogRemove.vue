<script setup lang="ts">
import type { McpGatewayObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'

const props = defineProps<{
  gateway: McpGatewayObject
  manager: string
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
async function removeGateway() {
  await client.request('DELETE /mcp/:manager/gateways/:gateway', {
    data: {
      manager: props.manager,
      gateway: props.gateway.identity,
    },
    onSuccess: () => {
      alerts.success(t('success', { identity: props.gateway.identity }))
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
    :title="t('title', { identity: gateway.identity })"
    :text="t('text', { identity: gateway.identity })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirmIdentity !== gateway.identity"
    @confirm="() => removeGateway()">
    <InputText
      v-model="confirmIdentity"
      :label="t('label')"
      :placeholder="gateway.identity"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Remove gateway
  text: Remove gateway **{identity}** from this manager. This will unassign the gateway but not delete it from the system.
  label: Type the gateway identity to confirm
  cancel: Cancel
  confirm: Remove
  success: Gateway **{identity}** has been removed from the manager.
fr:
  title: Supprimer la passerelle
  text: Supprimer la passerelle **{identity}** de ce gestionnaire. Cela désassignera la passerelle mais ne la supprimera pas du système.
  label: Tapez l'identité de la passerelle pour confirmer
  cancel: Annuler
  confirm: Supprimer
  success: La passerelle **{identity}** a été supprimée du gestionnaire.
de:
  title: Gateway entfernen
  text: Entfernen Sie das Gateway **{identity}** von diesem Manager. Dies wird das Gateway nicht zuweisen, aber nicht aus dem System löschen.
  label: Geben Sie die Gateway-Identität zur Bestätigung ein
  cancel: Abbrechen
  confirm: Entfernen
  success: Gateway **{identity}** wurde vom Manager entfernt.
es:
  title: Eliminar puerta de enlace
  text: Eliminar la puerta de enlace **{identity}** de este administrador. Esto desasignará la puerta de enlace pero no la eliminará del sistema.
  label: Escribe la identidad de la puerta de enlace para confirmar
  cancel: Cancelar
  confirm: Eliminar
  success: La puerta de enlace **{identity}** ha sido eliminada del administrador.
zh:
  title: 移除网关
  text: 从此管理器中移除网关 **{identity}**。这将取消分配网关但不会从系统中删除它。
  label: 输入网关标识以确认
  cancel: 取消
  confirm: 移除
  success: 网关 **{identity}** 已从管理器中移除。
</i18n>
