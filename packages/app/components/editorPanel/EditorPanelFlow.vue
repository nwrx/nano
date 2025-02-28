<script setup lang="ts">
const localSettings = useLocalSettings()
const session = useEditor()
</script>

<template>
  <div>

    <!-- Name -->
    <EditorPanelHeader
      :name="session.data.name"
      :description="session.data.description"
      @update:name="(value) => session.setMetaValues({ name: 'name', value })"
      @update:description="(value) => session.setMetaValues({ name: 'description', value })"
    />

    <EditorPanelFlowSettings />

    <EditorPanelSection v-model="localSettings.editorPanelDebugOpen" title="Debug" text="Debugging options.">
      <DataSheet :model-value="session" title="Session" />
    </EditorPanelSection>
  </div>
</template>
