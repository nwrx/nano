<script setup lang="ts">
const props = defineProps<{
  address: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <AppDialog
    v-model="model"
    class-hint="hint-warning"
    class-button="button-warning"
    icon="i-carbon:close"
    :title="t('dialog.disable.title')"
    :text="t('dialog.disable.text')"
    :label-cancel="t('dialog.disable.cancel')"
    :label-confirm="t('dialog.disable.confirm')"
    @confirm="() => emit('submit')">
    <div class="flex items-center space-x-sm">
      <Badge
        size="small"
        :label="address"
        class="font-normal badge-soft badge-primary"
      />
    </div>
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Disable the {identity} thread runner
  hint: This will disable the runner server and prevent it from accepting new tasks.
  confirm: Disable the Server
  cancel: Keep it running
</i18n>
