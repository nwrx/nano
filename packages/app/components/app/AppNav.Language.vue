<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n'

const props = defineProps<{
  modelValue?: string
  locales?: Array<{ icon: string } & LocaleObject>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// --- Value and icon for the current locale.
const isOpen = ref(false)
const model = useVModel(props, 'modelValue', emit, { passive: true })
const icon = computed(() => props.locales?.find(language => language.code === model.value)?.icon)

// --- Sort locales by code and filter out invalid locales.
const locales = computed(() => props.locales
  ?.filter(language => language.name && language.code)
  ?.sort((a, b) => a.code.localeCompare(b.code)))
</script>

<template>
  <ContextMenu
    v-model="isOpen"
    x="right"
    y="below"
    @mouseenter="() => isOpen = true"
    @mouseleave="() => isOpen = false">

    <!-- Language Button -->
    <AppNavFab :icon="icon" />

    <!-- Menu -->
    <template #menu="{ close }">
      <div class="flex flex-col space-y-2">
        <ContextMenuItem
          v-for="language in locales"
          :key="language.code"
          :label="language.name!"
          :class="{ 'font-semibold': language.code === model }"
          :icon="language.icon"
          :keybind="language.code"
          @click="() => { model = language.code; close() }"
        />
      </div>
    </template>
  </ContextMenu>
</template>
