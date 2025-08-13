<script setup lang="ts">
import type { McpManagerObject } from '@nwrx/nano-api'

const props = defineProps<{ manager: McpManagerObject }>()
const emit = defineEmits<{ 'submit': [] }>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const model = defineModel({ default: false })
const address = ref('')

// --- Submit.
async function addGateway() {
  await client.requestAttempt('POST /mcp/:identity/gateways', {
    data: {
      identity: props.manager.identity,
      address: address.value,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success'))
    },
  })
}

// --- State.
watch(model, () => address.value = '', { immediate: true })
</script>

<template>
  <Dialog
    v-model="model"
    class-hint="hint-success"
    class-button="button-success"
    icon="i-carbon:gateway"
    :title="t('title')"
    :text="t('hint')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="!address"
    @confirm="() => addGateway()">
    <InputText
      v-model="address"
      :placeholder="t('addressPlaceholder')"
      :hint="t('addressHint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Add gateway to manager
  hint: Enter the address of the MCP gateway to assign to this manager. The gateway must be accessible and not already assigned.
  confirm: Add gateway
  cancel: Cancel
  success: Gateway added successfully
  addressPlaceholder: gateway.mcp.acme.com
  addressHint: Can also include the port and protocol (ex. http://localhost:3001)
fr:
  title: Ajouter une passerelle au gestionnaire
  hint: Entrez l'adresse de la passerelle MCP à assigner à ce gestionnaire. La passerelle doit être accessible et ne pas être déjà assignée.
  confirm: Ajouter la passerelle
  cancel: Annuler
  success: Passerelle ajoutée avec succès
  addressPlaceholder: gateway.mcp.acme.com
  addressHint: Peut aussi inclure le port et le protocole (ex. http://localhost:3001)
de:
  title: Gateway zum Manager hinzufügen
  hint: Geben Sie die Adresse des MCP-Gateways ein, das diesem Manager zugewiesen werden soll. Das Gateway muss erreichbar und darf nicht bereits zugewiesen sein.
  confirm: Gateway hinzufügen
  cancel: Abbrechen
  success: Gateway erfolgreich hinzugefügt
  addressPlaceholder: gateway.mcp.acme.com
  addressHint: Kann auch Port und Protokoll enthalten (z.B. http://localhost:3001)
es:
  title: Agregar puerta de enlace al administrador
  hint: Ingrese la dirección de la puerta de enlace MCP a asignar a este administrador. La puerta de enlace debe estar accesible y no debe haber sido asignada previamente.
  confirm: Agregar puerta de enlace
  cancel: Cancelar
  success: Puerta de enlace agregada exitosamente
  addressPlaceholder: gateway.mcp.acme.com
  addressHint: También puede incluir el puerto y protocolo (ej. http://localhost:3001)
zh:
  title: 向管理器添加网关
  hint: 输入要分配给此管理器的MCP网关地址。网关必须可访问且未被分配。
  confirm: 添加网关
  cancel: 取消
  success: 网关添加成功
  addressPlaceholder: gateway.mcp.acme.com
  addressHint: 也可以包含端口和协议（例如 http://localhost:3001）
</i18n>
