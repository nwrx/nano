<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'

const emit = defineEmits<{
  'submit': [address: string]
}>()

const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const address = ref('')

// --- Submit.
async function registerManager() {
  await client.requestAttempt('POST /api/mcp', {
    data: {
      address: address.value,
    },
    onSuccess: () => {
      emit('submit', address.value)
      alerts.success(t('success'))
    },
  })
}

const isOpen = defineModel({ default: false })
watch(isOpen, () => address.value = '', { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-hint="hint-success"
    class-button="button-success"
    icon="i-carbon:bare-metal-server-02"
    :title="t('title')"
    :text="t('hint')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="!address"
    @confirm="() => registerManager()">

    <!-- Address -->
    <InputText
      v-model="address"
      :placeholder="t('addressPlaceholder')"
      :hint="t('addressHint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Register a new MCP manager
  hint: Enter the address of the MCP manager server to register. The server must be accessible and not already registered.
  confirm: Register this manager
  cancel: Cancel
  success: MCP manager registered successfully
  addressPlaceholder: manager.mcp.acme.com
  addressHint: Can also include the port and protocol (ex. http://localhost:3000)
fr:
  title: Enregistrer un nouveau gestionnaire MCP
  hint: Entrez l'adresse du serveur gestionnaire MCP à enregistrer. Le serveur doit être accessible et ne pas être déjà enregistré.
  confirm: Enregistrer ce gestionnaire
  cancel: Annuler
  success: Gestionnaire MCP enregistré avec succès
  addressPlaceholder: manager.mcp.acme.com
  addressHint: Peut aussi inclure le port et le protocole (ex. http://localhost:3000)
de:
  title: Neuen MCP-Manager registrieren
  hint: Geben Sie die Adresse des zu registrierenden MCP-Manager-Servers ein. Der Server muss erreichbar und darf nicht bereits registriert sein.
  confirm: Diesen Manager registrieren
  cancel: Abbrechen
  success: MCP-Manager erfolgreich registriert
  addressPlaceholder: manager.mcp.acme.com
  addressHint: Kann auch Port und Protokoll enthalten (z.B. http://localhost:3000)
es:
  title: Registrar un nuevo administrador MCP
  hint: Ingrese la dirección del servidor administrador MCP a registrar. El servidor debe estar accesible y no debe haber sido registrado previamente.
  confirm: Registrar este administrador
  cancel: Cancelar
  success: Administrador MCP registrado exitosamente
  addressPlaceholder: manager.mcp.acme.com
  addressHint: También puede incluir el puerto y protocolo (ej. http://localhost:3000)
zh:
  title: 注册新MCP管理器
  hint: 输入要注册的MCP管理器服务器地址。服务器必须可访问且未被注册。
  confirm: 注册此管理器
  cancel: 取消
  success: MCP管理器注册成功
  addressPlaceholder: manager.mcp.acme.com
  addressHint: 也可以包含端口和协议（例如 http://localhost:3000）
</i18n>
