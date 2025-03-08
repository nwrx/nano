<script setup lang="ts">
import type { ProjectObject } from '@nwrx/nano-api'

const props = defineProps<{
  modelValue: string
  multiple?: boolean
  workspace: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const search = ref('')
const client = useClient()
const model = useVModel(props, 'modelValue', emit, { passive: true })

const projects = ref([]) as Ref<ProjectObject[]>
async function searchProjects() {
  await client.requestAttempt('GET /api/workspaces/:workspace/projects', {
    data: {
      limit: 5,
      withProfile: true,
      search: search.value,
      workspace: props.workspace,
    },
    onData: (data) => {
      projects.value = data
    },
  })
}

watch(search, (search) => {
  if (search) void searchProjects()
  else projects.value = []
})
</script>

<template>
  <InputList
    v-model="model"
    v-model:search="search"
    icon="i-carbon:search"
    :options="projects"
    :option-value="(option) => option.name"
    :option-label="(option) => option.title"
    :option-text="(option) => option.description"
    @focus="() => searchProjects()"
  />
</template>
