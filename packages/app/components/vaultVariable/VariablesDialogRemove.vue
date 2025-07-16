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
const isOpen = useVModel(props, 'modelValue', emit)

async function removeVariable() {
  await client.requestAttempt('DELETE /api/workspaces/:workspace/vaults/:vault/variables/:variable', {
    data: {
      workspace: props.workspace,
      variable: props.variable,
      vault: props.vault,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success'))
    },
  })
}

// --- State.
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:delete"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { ...props })"
    :text="t('text', { ...props })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => removeVariable()">
    <div class="p-3 bg-prominent rd b b-app">
      <div class="text-sm font-medium">
        {{ t('info.variable') }}
      </div>
      <div class="text-sm text-gray-500">
        {{ variable }}
      </div>
      <div class="text-sm font-medium mt-2">
        {{ t('info.vault') }}
      </div>
      <div class="text-sm text-gray-500">
        {{ vault }}
      </div>
      <div class="text-sm font-medium mt-2">
        {{ t('info.createdAt') }}
      </div>
    </div>
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Remove variable **{workspace}/{vault}/{variable}**
  text: Are you sure you want to delete this variable? This action cannot be undone.
  cancel: Cancel
  confirm: Delete variable
  success: Variable deleted successfully
  info:
    variable: Variable name
    vault: Vault
    createdAt: Created
</i18n>
