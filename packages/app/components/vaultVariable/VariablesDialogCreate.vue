<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  workspace: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()

const vault = ref('')
const name = ref('')
const value = ref('')

async function createVariable() {
  await client.requestAttempt('POST /api/workspaces/:workspace/vaults/:vault/variables', {
    data: {
      workspace: props.workspace,
      vault: vault.value,
      name: name.value,
      value: value.value,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success'))
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => {
  vault.value = ''
  name.value = ''
  value.value = ''
}, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:add"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('title', { workspace })"
    :text="t('text', { workspace })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => createVariable()">
    <div class="space-y-4">
      <!-- Vault selector -->
      <VaultSearch
        v-model="vault"
        :workspace="workspace"
      />

      <!-- Variable name -->
      <InputText
        v-model="name"
        :placeholder="t('form.name.placeholder')"
        :label="t('form.name.label')"
        :hint="t('form.name.hint')"
      />

      <!-- Variable value -->
      <InputText
        v-model="value"
        type="textarea"
        :placeholder="t('form.value.placeholder')"
        :label="t('form.value.label')"
        :hint="t('form.value.hint')"
      />
    </div>
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Create a new variable in the **{workspace}** workspace
  text: Create a variable to store sensitive information that can be securely used across your workspace.
  cancel: Cancel
  confirm: Create variable
  success: Variable created successfully
  form:
    vault:
      label: Vault
      hint: Select the vault where this variable will be stored
    name:
      label: Variable name
      placeholder: Enter variable name
      hint: Use only alphanumeric characters, underscores, and hyphens
    value:
      label: Variable value
      placeholder: Enter the secret value
      hint: This value will be securely stored and accessible only to authorized users
  validation:
    vault:
      required: Please select a vault
    name:
      required: Variable name is required
      pattern: Variable name can only contain letters, numbers, underscores, and hyphens
    value:
      required: Variable value is required
</i18n>
