<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import { createProjectsClient } from '~/composables/useProject'

const props = defineProps<{
  multiple?: boolean
  workspace: string
}>()

const projects = createProjectsClient({ workspace: props.workspace })
const model = defineModel<string>()

watch(() => projects.options.search, () => {
  void projects.searchProjects()
})
</script>

<template>
  <InputList
    v-model="model"
    v-model:search="projects.options.search"
    icon="i-carbon:search"
    :options="projects.data"
    :option-value="(option) => option.name"
    :option-label="(option) => option.title"
    :option-text="(option) => option.description"
    @focus="() => projects.searchProjects()"
  />
</template>
