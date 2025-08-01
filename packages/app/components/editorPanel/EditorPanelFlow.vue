<script setup lang="ts">
import type { FlowObject } from '@nwrx/nano-api'
import DataSheetRow from '~/components/base/DataSheet.Row.vue'
import DataSheet from '~/components/base/DataSheet.vue'
import EditorPanelHeader from './EditorPanel.Header.vue'
import EditorPanelSection from './EditorPanel.Section.vue'

defineProps<{
  flow?: FlowObject
}>()

const emit = defineEmits<{
  'metadataUpdate': Array<{ name: string; value: unknown }>
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
      :placeholder-name="t('metaTitle')"
      :placeholder-description="t('metaDescription')"
      @update:name="(value) => emit('metadataUpdate', { name: 'title', value })"
      @update:description="(value) => emit('metadataUpdate', { name: 'description', value })"
    />

    <EditorPanelSection
      v-model="settings.editorPanelFlowSettingsOpen"
      class-content="space-y-md"
      title="HTTP"
      text="Define the behavior of the HTTP trigger.">
      <DataSheet>
        <DataSheetRow
          :name="t('settingsName')"
          is-editable
          :model-value="flow?.name"
          @update:model-value="(value) => emit('metadataUpdate', { name: 'name', value })"
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
  metaTitle: Give your flow a name
  metaDescription: Describe your flow in a few words.
  settingsName: Name
</i18n>
