<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [username: string]
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
const search = ref<string>('')
const username = ref<string[]>([])

// --- Reset when dialog is closed/opened.
watch(model, () => {
  search.value = ''
  username.value = []
})
</script>

<template>
  <AppDialog
    v-model="model"
    icon="i-carbon:warning"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { workspace })"
    :text="t('text', { workspace })"
    :label-cancel="t('button.cancel')"
    :label-confirm="t('button.confirm')"
    :disabled="username.length === 0"
    @confirm="() => emit('submit', username[0])">

    <!-- Search -->
    <UserSearch
      v-model="username"
      v-model:search="search"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Assign a new member to **{workspace}** workspace
  text: You are about to assign a new member to this workspace. They will have access to all projects they are specifically assigned to within this workspace.
  button.cancel: Cancel
  button.confirm: Assign user to workspace
</i18n>
