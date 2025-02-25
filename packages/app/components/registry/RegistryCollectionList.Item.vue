<script setup lang="ts">
import type { RegistryCollectionObject } from '@nwrx/nano-api'

const props = defineProps<{
  collection: RegistryCollectionObject
  modelValue?: boolean
  isFirst?: boolean
  isLast?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
})

const name = computed(() => props.collection.name)
const workspace = computed(() => props.collection.workspace!.name)

const components = useRegistryComponents(workspace, name, {
  withInputs: true,
  withOutputs: true,
})

watch(model, async(isOpen) => {
  if (isOpen) await components.searchComponents()
})
</script>

<template>
  <div ref="dropzone" class="w-full relative">
    <RegistryCollectionListItemHeader
      v-model="model"
      :collection="collection"
      :is-first="isFirst"
      :is-last="isLast"
    />

    <Collapse v-model="model">
      <RegistryCollectionListItemDetail
        v-if="collection"
        :collection="collection"
        :components="components.data.value"
      />
    </Collapse>
  </div>
</template>
