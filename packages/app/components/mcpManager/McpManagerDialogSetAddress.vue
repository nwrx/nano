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
const address = ref<string>()

// --- Submit.
async function setManagerAddress() {
  await client.request('PUT /mcp/:identity', {
    data: {
      identity: props.manager.identity,
      address: address.value,
    },
    onSuccess: () => {
      alerts.success(t('success', { identity: props.manager.identity }))
      emit('submit')
    },
  })
}

// --- State.
const isOpen = defineModel({ default: false })
watch(isOpen, () => address.value = props.manager.address, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:network-1"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { identity: manager.identity })"
    :text="t('text', { identity: manager.identity })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="address === (manager.address || '')"
    @confirm="() => setManagerAddress()">

    <!-- Address -->
    <InputText
      v-model="address"
      :label="t('addressLabel')"
      :placeholder="t('addressPlaceholder')"
      :hint="t('addressHint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Change manager address
  text: Update the address where manager **{identity}** can be reached.
  addressLabel: Manager address
  addressPlaceholder: Enter the new manager address
  addressHint: The address where the MCP manager can be reached (e.g., http://manager.mcp.acme.com)
  cancel: Cancel
  confirm: Change address
  success: Manager **{identity}** address updated successfully.
fr:
  title: Changer l'adresse du gestionnaire
  text: Mettre à jour l'adresse où le gestionnaire **{identity}** peut être atteint.
  addressLabel: Adresse du gestionnaire
  addressPlaceholder: Entrez la nouvelle adresse du gestionnaire
  addressHint: L'adresse où le gestionnaire MCP peut être atteint (ex. http://manager.mcp.acme.com)
  cancel: Annuler
  confirm: Changer l'adresse
  success: L'adresse du gestionnaire **{identity}** a été mise à jour avec succès.
de:
  title: Manager-Adresse ändern
  text: Aktualisieren Sie die Adresse, unter der der Manager **{identity}** erreichbar ist.
  addressLabel: Manager-Adresse
  addressPlaceholder: Geben Sie die neue Manager-Adresse ein
  addressHint: Die Adresse, unter der der MCP-Manager erreichbar ist (z.B. http://manager.mcp.acme.com)
  cancel: Abbrechen
  confirm: Adresse ändern
  success: Die Adresse des Managers **{identity}** wurde erfolgreich aktualisiert.
es:
  title: Cambiar dirección del administrador
  text: Actualizar la dirección donde se puede alcanzar al administrador **{identity}**.
  addressLabel: Dirección del administrador
  addressPlaceholder: Introduce la nueva dirección del administrador
  addressHint: La dirección donde se puede alcanzar al administrador MCP (ej. http://manager.mcp.acme.com)
  cancel: Cancelar
  confirm: Cambiar dirección
  success: Dirección del administrador **{identity}** actualizada con éxito.
zh:
  title: 更改管理器地址
  text: 更新管理器 **{identity}** 可访问的地址。
  addressLabel: 管理器地址
  addressPlaceholder: 输入新的管理器地址
  addressHint: MCP管理器可访问的地址（例如：http://manager.mcp.acme.com）
  cancel: 取消
  confirm: 更改地址
  success: 成功更新管理器 **{identity}** 的地址。
</i18n>
