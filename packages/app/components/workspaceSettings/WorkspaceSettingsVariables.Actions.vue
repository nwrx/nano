<script setup lang="ts">
defineProps<{
  workspace: string
  variable: string
  vault: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

const { t } = useI18n()
const showUpdateDialog = ref(false)
const showRemoveDialog = ref(false)
</script>

<template>
  <div>
    <ContextMenu x="right" y="top">
      <template #menu>
        <ContextMenuItem
          icon="i-carbon:edit"
          :label="t('actions.update')"
          @click="() => showUpdateDialog = true"
        />
        <ContextMenuItem
          icon="i-carbon:delete"
          :label="t('actions.remove')"
          @click="() => showRemoveDialog = true"
        />
      </template>
    </ContextMenu>

    <!-- Update dialog -->
    <WorkspaceSettingsVariablesDialogUpdate
      v-model="showUpdateDialog"
      :workspace="workspace"
      :variable="variable"
      :vault="vault"
      @submit="() => emit('submit')"
    />

    <!-- Remove dialog -->
    <WorkspaceSettingsVariablesDialogRemove
      v-model="showRemoveDialog"
      :workspace="workspace"
      :variable="variable"
      :vault="vault"
      @submit="() => emit('submit')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  actions:
    update: Update value
    remove: Delete variable
</i18n>
