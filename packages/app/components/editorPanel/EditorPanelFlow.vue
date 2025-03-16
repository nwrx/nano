<script setup lang="ts">
defineProps<{
  editor: Editor
}>()

const { t } = useI18n()
const settings = useLocalSettings()
</script>

<template>
  <div>

    <!-- Name -->
    <EditorPanelHeader
      :name="editor.model.title"
      :description="editor.model.description"
      :placeholder-name="t('meta.title')"
      :placeholder-description="t('meta.description')"
      @update:name="(value) => editor.model.setMetaValues({ name: 'title', value })"
      @update:description="(value) => editor.model.setMetaValues({ name: 'description', value })"
    />

    <EditorPanelSection
      v-model="settings.editorPanelFlowSettingsOpen"
      class-content="space-y-md"
      title="HTTP"
      text="Define the behavior of the HTTP trigger.">
      <EditorPanelDataContainer>
        <DataSheetRow
          :name="t('settings.name')"
          is-editable
          :model-value="editor.model.name"
          @update:model-value="(value) => editor.model.setMetaValues({ name: 'name', value })"
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
      </EditorPanelDataContainer>
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
