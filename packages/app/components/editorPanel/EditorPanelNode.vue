<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { Editor } from '@nwrx/nano-api'

const props = defineProps<{
  node: Editor.NodeObject
  component: Editor.ComponentObject
}>()

const emit = defineEmits<{
  'setNodesLabel': Array<{ id: string; label: string }>
  'setNodesComment': Array<{ id: string; comment: string }>
  // 'nodesInputUpdate': Array<{ id: string; name: string; value: unknown }>
}>()

const { t } = useI18n()
const settings = useLocalSettings()

const title = computed(() => {
  if (props.node.metadata.label) return props.node.metadata.label
  if (props.component.title) return localize(props.component.title)
  return props.node.name
})

const description = computed(() => {
  if (props.node.metadata.comment) return props.node.metadata.comment
  return ''
})
</script>

<template>
  <div>

    <!-- Title & Desscription -->
    <EditorPanelHeader
      :name="title"
      :description="description"
      :placeholder-name="t('headerLabel')"
      :placeholder-description="t('headerComment')"
      @update:name="label => emit('setNodesLabel', { id: node!.id, label })"
      @update:description="comment => emit('setNodesComment', { id: node!.id, comment })"
    />

    <!-- Error Hint -->
    <EditorPanelError
      v-if="node.error"
      :message="node.error.message"
      :name="node.error.name"
      :context="node.error.data"
    />

    <!-- Input Data Table -->
    <EditorPanelSection
      v-model="settings.editorPanelNodeInputOpen"
      :title="t('nodeInputsTitle')"
      :text="t('nodeInputsText')">
      <DataSheet :model-value="node.input" />
    </EditorPanelSection>

    <!-- Output Data Table -->
    <EditorPanelSection
      v-model="settings.editorPanelNodeOutputOpen"
      :title="t('nodeOutputsTitle')"
      :text="t('nodeOutputsText')">
      <DataSheet :model-value="node.result" />
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
          Position: node.metadata.position,
          Inputs: component.inputs,
          Outputs: component.outputs,
        }"
      />
    </EditorPanelSection>

  </div>
</template>
