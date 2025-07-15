<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'

// --- I/O.
const emit = defineEmits<{ 'submit': [address: string] }>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const address = ref('')
const isOpen = defineModel({ default: false })
watch(isOpen, () => address.value = '', { immediate: true })

// --- Methods.
async function claimRunner() {
  await client.requestAttempt('POST /api/runners', {
    data: {
      address: address.value,
    },
    onSuccess: () => {
      emit('submit', address.value)
      alerts.success(t('success'))
    },
  })
}
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-hint="hint-success"
    class-button="button-success"
    icon="i-carbon:cloud-service-management"
    :title="t('title')"
    :text="t('hint')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="!address"
    @confirm="() => claimRunner()">

    <!-- Claim new runner at address -->
    <InputText
      v-model="address"
      :placeholder="t('addressPlaceholder')"
      :hint="t('addressHint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Claim a new runner
  hint: Enter the address of the runner server to claim. The server must be accessible and not already claimed.
  confirm: Claim this runner
  cancel: Cancel
  success: Runner claimed successfully
  addressPlaceholder: my-runner.acme.com
  addressHint: Can also include the port and protocol (ex. http://localhost:3000)
fr:
  title: Revendiquer un nouveau serveur d'exécution
  hint: Entrez l'adresse du serveur d'exécution à revendiquer. Le serveur doit être accessible et ne pas être déjà revendiqué.
  confirm: Revendiquer ce serveur d'exécution
  cancel: Annuler
  success: Serveur d'exécution revendiqué avec succès
  addressPlaceholder: mon-serveur-execution.acme.com
  addressHint: Peut aussi inclure le port et le protocole (ex. http://localhost:3000)
de:
  title: Neuen Ausführungsserver beanspruchen
  hint: Geben Sie die Adresse des zu beanspruchenden Ausführungsservers ein. Der Server muss erreichbar und darf nicht bereits beansprucht sein.
  confirm: Diesen Ausführungsserver beanspruchen
  cancel: Abbrechen
  success: Ausführungsserver erfolgreich beansprucht
  addressPlaceholder: mein-ausfuehrungsserver.acme.com
  addressHint: Kann auch Port und Protokoll enthalten (z.B. http://localhost:3000)
es:
  title: Reclamar un nuevo servidor de ejecución
  hint: Ingrese la dirección del servidor de ejecución a reclamar. El servidor debe estar accesible y no debe haber sido reclamado previamente.
  confirm: Reclamar este servidor de ejecución
  cancel: Cancelar
  success: Servidor de ejecución reclamado exitosamente
  addressPlaceholder: mi-servidor-ejecucion.acme.com
  addressHint: También puede incluir el puerto y protocolo (ej. http://localhost:3000)
zh:
  title: 声明新执行服务器
  hint: 输入要声明的执行服务器地址。服务器必须可访问且未被声明。
  confirm: 声明此执行服务器
  cancel: 取消
  success: 执行服务器声明成功
  addressPlaceholder: my-execution-server.acme.com
  addressHint: 也可以包含端口和协议（例如 http://localhost:3000）
</i18n>
