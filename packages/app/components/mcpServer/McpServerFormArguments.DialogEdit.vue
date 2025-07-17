<script setup lang="ts">
import type { McpServerArgumentObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'

const props = defineProps<{
  workspace: string
  pool: string
  server: string
  argument: McpServerArgumentObject
}>()

const emit = defineEmits<{
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const value = ref<string>()

// --- Submit.
async function submit() {
  await client.requestAttempt(
    'PUT /api/workspaces/:workspace/pools/:pool/servers/:server/arguments/:position',
    {
      data: {
        workspace: props.workspace,
        pool: props.pool,
        server: props.server,
        position: props.argument.position,
        value: value.value,
      },
      onSuccess: () => {
        emit('submit')
        alerts.success(t('success'))
      },
    },
  )
}

// --- State.
const isOpen = defineModel({ default: false })
watch(isOpen, () => {
  if (!isOpen.value) return
  if (!props.argument) return
  value.value = props.argument.value
}, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:edit"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { position: props.argument.position, server: props.server })"
    :text="t('text')"
    :label-confirm="t('confirm')"
    :label-cancel="t('cancel')"
    @confirm="() => submit()">
    <InputText
      v-model="value"
      type="textarea"
      :label="t('valueLabel')"
      :placeholder="t('valuePlaceholder')"
      :hint="t('valueHint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Edit the argument at **position {position}** of server **{server}**
  text: Update the name and value of this server argument. Changes will be applied immediately.
  confirm: Update argument
  cancel: Cancel changes
  success: Argument has been updated successfully.
  valueLabel: Argument value
  valuePlaceholder: Enter the argument value
  valueHint: The value of the argument, can be a string or a number.
</i18n>
