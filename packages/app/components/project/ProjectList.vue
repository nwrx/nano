<script setup lang="ts">
import type { WorkspaceProjectObject } from '@nwrx/api'

const props = defineProps<{
  workspace?: string
  projects?: WorkspaceProjectObject[]
  modelValue?: Record<string, boolean>
}>()

const emit = defineEmits<{
  projectDelete: [project: string]
  flowCreate: [project: string]
  flowDelete: [project: string, flow: string]
  flowImport: [project: string, file: File]
  flowDuplicate: [project: string, flow: string]
  'update:modelValue': [value: Record<string, boolean>]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
  defaultValue: {},
}) as ComputedRef<Record<string, boolean>>
</script>

<template>
  <div v-if="workspace" class="flex flex-col w-full">
    <ProjectListItem
      v-for="project in projects"
      :key="project.name"
      v-model:model-value="model[project.name]"
      v-bind="project"
      :workspace="workspace"
      class="pb-md"
      @delete="() => emit('projectDelete', project.name)"
      @flow-create="() => emit('flowCreate', project.name)"
      @flow-import="file => emit('flowImport', project.name, file)"
      @flow-delete="flow => emit('flowDelete', project.name, flow)"
      @flow-duplicate="flow => emit('flowDuplicate', project.name, flow)"
    />
  </div>
</template>
