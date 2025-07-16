<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  workspace: string
  variable: string
  vault: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const value = ref('')
const isOpen = useVModel(props, 'modelValue', emit)

async function updateVariable() {
  await client.requestAttempt('PUT /api/workspaces/:workspace/vaults/:vault/variables/:variable', {
    data: {
      workspace: props.workspace,
      variable: props.variable,
      vault: props.vault,
      value: value.value,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success', { ...props }))
      isOpen.value = false
    },
  })
}

// --- State.
watch(isOpen, () => value.value = '', { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:edit"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { ...props })"
    :text="t('text', { ...props })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => updateVariable()">
    <InputText
      v-model="value"
      type="textarea"
      :placeholder="t('form.value.placeholder')"
      :hint="t('form.value.hint')"
      class-input="h-48"
      required
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Update the value of the **{workspace}/{vault}/{variable}** variable
  text: You can update the value of this variable. Keep in mind that this action is irreversible and will affect all flows that depend on this variable.
  cancel: Keep the current value
  confirm: Update variable value
  success: The value of the **{workspace}/{vault}/{variable}** variable has been updated successfully
  info:
    variable: Variable name
    vault: Vault
  form:
    value:
      placeholder: Enter the new value for this variable
      hint: This value will replace the current value of the variable
</i18n>
