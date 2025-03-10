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

async function disableRunner() {
  await client.requestAttempt('PUT /api/runners/:identity/disable', {
    data: {
      identity: props.identity,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success'))
    },
  })
}

watch(model, () => props.identity, { immediate: true })
</script>

<template>
  <Dialog
    v-model="model"
    class-hint="hint-warning"
    class-button="button-warning"
    icon="i-carbon:close"
    :title="t('title', { identity })"
    :text="t('text', { identity })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => disableRunner()">
    <div class="flex items-center space-x-sm">
      <Badge
        size="small"
        :label="identity"
        class="font-normal badge-soft badge-primary"
      />
    </div>
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Disable the **{identity}** thread runner
  hint: This will disable the runner server and prevent it from accepting new tasks.
  confirm: Disable the Server
  cancel: Keep it running
</i18n>
