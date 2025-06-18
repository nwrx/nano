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
const address = ref('')

async function setRunnerAddress() {
  await client.request('PUT /api/runners/:identity', {
    data: {
      identity: props.runner.identity,
      address: address.value,
    },
    onSuccess: () => {
      alerts.success(t('success', { identity: props.runner.identity }))
      emit('submit')
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => address.value = props.runner.address || '', { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:network-1"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { identity: runner.identity })"
    :text="t('text', { identity: runner.identity })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="address === (runner.address || '')"
    @confirm="() => setRunnerAddress()">
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
  title: Change runner address
  text: Update the address where runner "{identity}" can be reached.
  addressLabel: Runner address
  addressPlaceholder: Enter the new runner address
  addressHint: The address where the runner can be reached (e.g., http://nano-runner-eu-west.acme.com)
  cancel: Cancel
  confirm: Change address
  success: Runner "{identity}" address updated successfully.
fr:
  title: Changer l'adresse du serveur d'exécution
  text: Mettre à jour l'adresse où le serveur d'exécution "{identity}" peut être atteint.
  addressLabel: Adresse du serveur d'exécution
  addressPlaceholder: Entrez la nouvelle adresse du serveur d'exécution
  addressHint: L'adresse où le serveur d'exécution peut être atteint (ex. http://nano-runner-eu-west.acme.com)
  cancel: Annuler
  confirm: Changer l'adresse
  success: L'adresse du serveur d'exécution "{identity}" a été mise à jour avec succès.
de:
  title: Ausführungsserver-Adresse ändern
  text: Aktualisieren Sie die Adresse, unter der der Ausführungsserver "{identity}" erreichbar ist.
  addressLabel: Ausführungsserver-Adresse
  addressPlaceholder: Geben Sie die neue Ausführungsserver-Adresse ein
  addressHint: Die Adresse, unter der der Ausführungsserver erreichbar ist (z.B. http://nano-runner-eu-west.acme.com)
  cancel: Abbrechen
  confirm: Adresse ändern
  success: Die Adresse des Ausführungsservers "{identity}" wurde erfolgreich aktualisiert.
es:
  title: Cambiar dirección del servidor de ejecución
  text: Actualizar la dirección donde se puede alcanzar al servidor de ejecución "{identity}".
  addressLabel: Dirección del servidor de ejecución
  addressPlaceholder: Introduce la nueva dirección del servidor de ejecución
  addressHint: La dirección donde se puede alcanzar al servidor de ejecución (ej. http://nano-runner-eu-west.acme.com)
  cancel: Cancelar
  confirm: Cambiar dirección
  success: Dirección del servidor de ejecución "{identity}" actualizada con éxito.
zh:
  title: 更改执行服务器地址
  text: 更新执行服务器 "{identity}" 可访问的地址。
  addressLabel: 执行服务器地址
  addressPlaceholder: 输入新的执行服务器地址
  addressHint: 执行服务器可访问的地址（例如：http://nano-runner-eu-west.acme.com）
  cancel: 取消
  confirm: 更改地址
  success: 成功更新执行服务器 "{identity}" 的地址。
</i18n>
