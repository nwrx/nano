<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'submit': [address: string]
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
const address = ref('')

function handleSubmit() {
  emit('submit', address.value)
  address.value = ''
}
</script>

<template>
  <AppDialog
    v-model="model"
    class-hint="hint-success"
    class-button="button-success"
    icon="i-carbon:cloud-service-management"
    :title="t('title')"
    :text="t('hint')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="!address"
    @confirm="() => handleSubmit()">

    <InputText
      v-model="address"
      :placeholder="t('address.placeholder')"
      :hint="t('address.hint')"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Claim a new runner
  hint: Enter the address of the runner server to claim. The server must be running and accessible.
  confirm: Claim this runner
  cancel: Cancel
  address.placeholder: my-runner.acme.com
  address.hint: Can also include the port and protocol (ex. http://localhost:3000)
fr:
  title: Réclamer un nouveau runner
  hint: Entrez l'adresse du serveur runner à réclamer. Le serveur doit être en cours d'exécution et accessible.
  confirm: Réclamer ce runner
  cancel: Annuler
  address.placeholder: mon-runner.acme.com
  address.hint: Peut également inclure le port et le protocole (ex. http://localhost:3000)
de:
  title: Einen neuen Runner beanspruchen
  hint: Geben Sie die Adresse des Runner-Servers ein, um ihn zu beanspruchen. Der Server muss ausgeführt und erreichbar sein.
  confirm: Diesen Runner beanspruchen
  cancel: Stornieren
  address.placeholder: mein-runner.acme.com
  address.hint: Kann auch den Port und das Protokoll enthalten (z. B. http://localhost:3000)
es:
  title: Reclamar un nuevo runner
  hint: Ingrese la dirección del servidor runner para reclamar. El servidor debe estar en funcionamiento y accesible.
  confirm: Reclamar este runner
  cancel: Cancelar
  address.placeholder: mi-runner.acme.com
  address.hint: También puede incluir el puerto y el protocolo (por ejemplo, http://localhost:3000)
zh:
  title: 认领新的 Runner
  hint: 输入要认领的 Runner 服务器的地址。服务器必须正在运行且可访问。
  confirm: 认领此 Runner
  cancel: 取消
  address.placeholder: my-runner.acme.com
  address.hint: 也可以包括端口和协议（例如 http://localhost:3000）
</i18n>
