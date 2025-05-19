<script setup lang="ts">
import type { FlowObject } from '@nwrx/nano-api'

defineProps<{
  flow?: FlowObject
}>()

const emit = defineEmits<{
  'setMetadata': Array<{ name: string; value: unknown }>
}>()

const { t } = useI18n()
const settings = useLocalSettings()
</script>

<template>
  <div>

    <!-- Name -->
    <EditorPanelHeader
      :name="flow?.title || flow?.name"
      :description="flow?.description"
      :placeholder-name="t('meta.title')"
      :placeholder-description="t('meta.description')"
      @update:name="(value) => emit('setMetadata', { name: 'title', value })"
      @update:description="(value) => emit('setMetadata', { name: 'description', value })"
    />

    <EditorPanelSection
      v-model="settings.editorPanelFlowSettingsOpen"
      class-content="space-y-md"
      title="HTTP"
      text="Define the behavior of the HTTP trigger.">
      <DataSheet>
        <DataSheetRow
          :name="t('settings.name')"
          is-editable
          :model-value="flow?.name"
          @update:model-value="(value) => emit('setMetadata', { name: 'name', value })"
        />
        <DataSheetRow
          name="Enabled"
          :model-value="false"
        />
        <DataSheetRow
          name="Override Variables"
          hint="Allow the user to override the variables via HTTP Headers."
        />
        <DataSheetRow
          name="Override Secrets"
          hint="Allow the user to override the secrets via HTTP Headers."
        />
      </DataSheet>
    </EditorPanelSection>
  </div>
</template>

<i18n lang="yaml">
en:
  meta:
    title: Give your flow a name
    description: Describe your flow in a few words.
  settings:
    name: Name
</i18n>
