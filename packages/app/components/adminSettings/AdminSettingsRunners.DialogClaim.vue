<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'submit': [address: string]
}>()

const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const model = useVModel(props, 'modelValue', emit, { passive: true })
const address = ref('')

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

watch(model, () => address.value = '', { immediate: true })
</script>

<template>
  <Dialog
    v-model="model"
    class-hint="hint-success"
    class-button="button-success"
    icon="i-carbon:cloud-service-management"
    :title="t('title')"
    :text="t('hint')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="!address"
    @confirm="() => claimRunner()">
    <InputText
      v-model="address"
      :placeholder="t('address.placeholder')"
      :hint="t('address.hint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Claim a new runner
  hint: Enter the address of the runner server to claim. The server must be running and accessible.
  confirm: Claim this runner
  cancel: Cancel
  success: Runner claimed successfully
  address:
    placeholder: my-runner.acme.com
    hint: Can also include the port and protocol (ex. http://localhost:3000)
</i18n>
