<script setup lang="ts">
import type { ProjectSetSettingsOptions } from '~/composables/useProject'

const props = defineProps<{
  name: string
  title?: string
  description?: string
  workspace: string
}>()

const emit = defineEmits<{
  submit: [ProjectSetSettingsOptions]
  'update:title': [value: string]
  'update:description': [value: string]
}>()

const title = useVModel(props, 'title', emit, { passive: true })
const description = useVModel(props, 'description', emit, { passive: true })
const slugTextBefore = computed(() => `${CONSTANTS.appHost}/${props.workspace}/`)

function onSubmit() {
  emit('submit', {
    title: title.value,
    description: description.value,
  })
}
</script>

<template>
  <AppPageForm
    title="General"
    submit-label="Save Changes"
    @submit="() => onSubmit()">
    <template #text>
      Describe and name your project. You can also define the URL slug that will be used in the API
      endpoint.
      <br>
      <br>
      Note that this might break existing integrations if you change it. For more information, please
      refer to the <Button link variant="primary" href="#">documentation</Button>.

    </template>
    <InputText
      v-model="title"
      icon="i-carbon:label"
      class="w-full"
    />
    <InputText
      readonly
      :modelValue="name"
      :text-before="slugTextBefore"
      hint="This is the unique identifier for your project and will define the path of your flows in the API."
      class="w-full"
    />
    <InputText
      v-model="description"
      placeholder="Give a brief description of your project."
      type="textarea"
      class-input="!h-32"
    />
  </AppPageForm>
</template>
