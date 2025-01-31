<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  languages: Array<{
    code: string
    name: string
    icon: string
  }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const icon = computed(() => props.languages.find(language => language.code === props.modelValue)?.icon)
const model = useVModel(props, 'modelValue', emit, { passive: true })
const languagesSorted = computed(() => props.languages.sort((a, b) => a.code.localeCompare(b.code)))
</script>

<template>
  <ContextMenu x="right" y="below">
    <BaseButton class="bg-white/0 hover:bg-white/20 transition rounded p-2">
      <BaseIcon :icon="icon" />
    </BaseButton>

    <!-- Menu -->
    <template #menu="{ close }">
      <div class="flex flex-col space-y-2">
        <ContextMenuItem
          v-for="language in languagesSorted"
          :key="language.code"
          :label="language.name"
          :class="{ 'font-semibold': language.code === model }"
          :icon="language.icon"
          :keybind="language.code"
          @click="() => { model = language.code; close() }"
        />
      </div>
    </template>
  </ContextMenu>
</template>
