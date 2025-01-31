<script setup lang="ts">
const props = defineProps<{
  title: string
  text: string
  name: string
  value?: string
  isOpen?: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [isOpen: boolean]
  'update': [name: string, value: string]
  'delete': [name: string]
}>()

// --- Two-way binding
const newValue = ref('')
const isOpen = useVModel(props, 'isOpen', emit, { passive: true })

// --- Reset the value.
function reset() {
  newValue.value = props.value ?? ''
}
</script>

<template>
  <AppDialog
    v-model="isOpen"
    :title="title"
    :text="text"
    @open="() => reset()">

    <template #default="{ open }">
      <div class="flex">
        <BaseButton
          eager
          class="font-mono font-medium text-xs bg-primary-900 text-primary-100 px-2 py-1 rounded"
          @click="() => open()"
        />

        <!-- CTA -->
        <div class="flex items-center justify-end space-x-4 flex-1 opacity-0 group-hover:opacity-80">
          <BaseButton>
            <BaseIcon icon="i-carbon:pen" class="w-4 h-4" />
          </BaseButton>
          <BaseButton>
            <BaseIcon icon="i-carbon:delete" class="w-4 h-4" />
          </BaseButton>
        </div>
      </div>
    </template>

    <template #dialog="{ close }">
      <div class="space-y-4">
        <InputText
          :value="name"
          readonly
        />
        <InputText
          v-model="newValue"
          type="textarea"
          placeholder="Value"
        />
        <Button
          link
          label="Update variable"
          @click="() => { emit('update', name, newValue); close() }"
        />
      </div>
    </template>
  </AppDialog>
</template>
