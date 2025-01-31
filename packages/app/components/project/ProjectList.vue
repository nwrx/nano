<script setup lang="ts">
import type { WorkspaceProjectObject } from '@nwrx/api'

const props = defineProps<{
  workspace: string
  projects?: WorkspaceProjectObject[]
  modelValue?: Record<string, boolean>
}>()

const emit = defineEmits<{
  projectDelete: [project: string]
  flowCreate: [project: string]
  flowDelete: [project: string, flow: string]
  flowDuplicate: [project: string, flow: string]
  'update:modelValue': [value: Record<string, boolean>]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
  defaultValue: {},
}) as ComputedRef<Record<string, boolean>>
</script>

<template>
  <div class="flex flex-col space-y-4 w-full">
    <ProjectListItem
      v-for="project in projects"
      :key="project.name"
      v-model:modelValue="model[project.name]"
      v-bind="project"
      :workspace="workspace"
      @delete="() => emit('projectDelete', project.name)"
      @flowCreate="() => emit('flowCreate', project.name)"
      @flowDelete="flow => emit('flowDelete', project.name, flow)"
      @flowDuplicate="flow => emit('flowDuplicate', project.name, flow)"
    />
  </div>
</template>
