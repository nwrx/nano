<script setup lang="ts">
import type { ThreadInputObject } from '@nwrx/nano'
import type { FlowSchema } from '@nwrx/nano-api'

const props = defineProps<{
  schema: FlowSchema
}>()

const model = defineModel<ThreadInputObject>({ default: () => ({}) })
const field = computed(() => props.schema.inputs[0])
</script>

<template>
  <div v-if="field && field.type === 'string'" class="w-full">
    <InputText
      v-model="model[field.name]"
      rows="4"
      type="textarea"
      class-group="input-lg rd-0 b-transparent"
      :placeholder="field.description ?? field.label"
    />
  </div>
</template>
