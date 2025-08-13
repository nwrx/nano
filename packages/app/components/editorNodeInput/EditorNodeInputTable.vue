<script setup lang="ts">
import type { Editor } from '@nwrx/nano-api'
import type { Schema } from '@nwrx/nano/utils'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import Collapse from '~/components/base/Collapse.vue'
import EditorNodeInputGroup from './EditorNodeInput.Group.vue'
import EditorNodeInputLabel from './EditorNodeInput.Label.vue'
import EditorNodeInputTableProperty from './EditorNodeInputTable.Property.vue'

const props = defineProps<{
  name: string
  node: Editor.NodeObject
  schema: Schema
  modelValue: unknown
  searchProperties: (query: string) => Promise<Record<string, Schema>>
}>()

const emit = defineEmits<{
  'update:modelValue': [unknown]
  'grab': [name: string]
  'assign': [name: string]
  'unassign': []
}>()

const value = computed({
  get: () => {
    const value = props.modelValue
    if (typeof value !== 'object' || value === null) return [['', '']]
    if (Object.keys(value).length === 0) return [['', '']]
    return Object.entries(value) as Array<[string, unknown]>
  },
  set: (value: Array<[string, unknown]>) => {
    const object = Object.fromEntries(value)
    emit('update:modelValue', object)
  },
}) as Ref<Array<[string, unknown]>>

// --- Force update the value.
function setPropertyPath(index: number, path: string) {
  value.value[index][0] = path
  value.value = [...value.value]
}
function setPropertyValue(index: number, newValue: unknown) {
  value.value[index][1] = newValue
  value.value = [...value.value]
}
function addProperty(index: number) {
  value.value.splice(index + 1, 0, ['', ''])
  value.value = [...value.value]
}
function removeProperty(index: number) {
  value.value.splice(index, 1)
  value.value = [...value.value]
}

// --- Number of entries in the object.
const count = computed(() => {
  const value = props.modelValue
  if (typeof value !== 'object' || value === null) return 0
  return Object.keys(value).length
})

// --- Collect used properties so they are not duplicated.
const usedProperties = computed(() => {
  const value = props.modelValue
  if (typeof value !== 'object' || value === null) return []
  return Object.keys(value)
})

// --- Open state, default to true when the initial value is not empty.
const show = ref<boolean>(false)
onMounted(() => { if (count.value > 0) show.value = true })

// --- When the field is "expanded", we want to fetch the properties.
// --- We also want to refresh the properties when the value changes unless it
// --- is closed.
const nodeInput = computed(() => props.node.input)
const nodeInputChanged = ref(false)
watch(nodeInput, () => nodeInputChanged.value = true, { deep: true })

// --- Get the properties from the API.
const properties = ref<Record<string, Schema>>({})
async function refreshProperties() {
  if (!show.value) return
  if (!nodeInputChanged.value) return
  const result = await props.searchProperties('')
  properties.value = result ?? props.schema.properties ?? {}
  nodeInputChanged.value = false
}

watch(
  nodeInput,
  () => refreshProperties(),
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="w-full">

    <!-- Label -->
    <EditorNodeInputGroup
      class="flex h-8 items-center justify-start w-full cursor-pointer group"
      @mousedown.stop="() => show = !show">

      <!-- Label -->
      <EditorNodeInputLabel
        :node="node"
        :name="name"
        :schema="schema"
        :hide-dash="true"
      />

      <!-- Spacer -->
      <span class="flex-1" />

      <!-- Expand icon -->
      <BaseIcon
        icon="i-carbon:chevron-down"
        class="size-5 transition-transform transform op-0 group-hover:op-100"
        :class="{ 'rotate-180': show }"
      />
    </EditorNodeInputGroup>

    <!-- Table content -->
    <Collapse
      :model-value="show"
      :class="{ 'b-b b-b-app': show }"
      class="-translate-x-6 -mr-10">

      <!-- Properties -->
      <EditorNodeInputTableProperty
        v-for="([propertyName, propertyValue], index) in value"
        :key="index"
        :property-value="propertyValue"
        :property-path="propertyName"
        :name="name"
        :node="node"
        :schema="schema"
        :properties="properties"
        :is-first="index === 0"
        :is-last="index === count - 1"
        :used-properties="usedProperties"
        @grab="() => emit('grab', propertyName)"
        @assign="() => emit('assign', propertyName)"
        @unassign="() => emit('unassign')"
        @update:property-value="(value: unknown) => setPropertyValue(index, value)"
        @update:property-path="(path: string) => setPropertyPath(index, path)"
        @remove-property="() => removeProperty(index)"
        @add-property="() => addProperty(index)"
      />
    </Collapse>
  </div>
</template>
