<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
const props = defineProps<{
  editor: Editor
}>()

const { t } = useI18n()
const settings = useLocalSettings()
const node = computed(() => {
  const nodeSelected = props.editor.view.nodeSelected
  return nodeSelected?.length === 1 ? nodeSelected[0] : undefined
})
</script>

<template>
  <div v-if="node">

    <!-- Title & Desscription -->
    <EditorPanelHeader
      :name="node.label ?? node.name"
      :description="node.comment"
      :placeholder-name="t('header.label')"
      :placeholder-description="t('header.comment')"
      @update:name="label => editor.model.setNodesLabel({ id: node!.id, label })"
      @update:description="comment => editor.model.setNodesComment({ id: node!.id, comment })"
    />

    <!-- Error Hint -->
    <EditorPanelError
      v-if="node.error"
      :message="node.error"
      :name="node.errorName"
      :context="node.errorContext"
    />

    <!-- Input Data Table -->
    <EditorPanelSection
      v-model="settings.editorPanelNodeInputOpen"
      :title="t('inputs.title')"
      :text="t('inputs.text')">
      <DataSheet :model-value="node.input" />
    </EditorPanelSection>

    <!-- Output Data Table -->
    <EditorPanelSection
      v-model="settings.editorPanelNodeOutputOpen"
      :title="t('outputs.title')"
      :text="t('outputs.text')">
      <DataSheet :model-value="node.output" />
    </EditorPanelSection>

    <!-- Metadata -->
    <EditorPanelSection
      v-model="settings.editorPanelNodeMetadataOpen"
      :title="t('metadata.title')"
      :text="t('metadata.text')">
      <DataSheet
        :model-value="{
          ID: node.id,
          Specifier: node.specifier,
          Position: node.position,
          Inputs: node.inputs,
          Outputs: node.outputs,
        }"
      />
    </EditorPanelSection>
  </div>
</template>

<i18n lang="yaml">
en:
  header:
    label: Give this node a label.
    comment: Provide additional information about this node.
  inputs:
    title: Input
    text: The current input data of this node.
    empty: This node does not expect any input data.
  outputs:
    title: Output
    text: The output data of the node.
    empty: This node does not produce any output data.
  metadata:
    title: Metadata
    text: The internal metadata of this node.
</i18n>
