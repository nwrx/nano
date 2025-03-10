<script setup lang="ts">
const props = defineProps<{
  identity: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()

const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const model = useVModel(props, 'modelValue', emit, { passive: true })

async function enableRunner() {
  await client.requestAttempt('PUT /api/runners/:identity/enable', {
    data: {
      identity: props.identity,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success', { identity: props.identity }))
    },
  })
}

watch(model, () => props.identity, { immediate: true })
</script>

<template>
  <Dialog
    v-model="model"
    class-hint="hint-success"
    class-button="button-success"
    icon="i-carbon:checkmark"
    :title="t('title', { identity })"
    :text="t('text', { identity })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => enableRunner()">
    <div class="flex items-center space-x-sm">
      <Badge
        size="small"
        :label="identity"
        class="font-normal badge-primary"
      />
    </div>
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Enable the **{identity}** thread runner
  text: This will enable the runner server and allow it to process new flow threads.
  confirm: Enable the runner
  cancel: Keep the runner disabled
</i18n>
