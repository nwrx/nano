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

const categoriesPurpose = computed(() => props.collection.categories?.filter(category => category.type === 'Purpose'))
</script>

<template>
  <BaseButton
    eager
    :class="{
      'rd-t': isFirst,
      'rd-b': isLast,
    }"
    class="
      flex items-center gap-md p-md w-full
      bg-subtle hover:bg-emphasized
      ring ring-app hover:ring-prominent mb-px
      cursor-pointer text-left
    "
    @click="() => model = !model">

    <!-- Icon -->
    <BaseIcon :icon="collection.icon" class="size-10 aspect-1/1 rd" />

    <!-- Title & description -->
    <div class="flex flex-col space-x-0 ml-sm grow">
      <h3 class="space-x-sm leading-tight">
        <span class="font-semibold text-base">{{ collection.title }}</span>
      </h3>
      <p class="text-sm text-subtle leading-tight">
        {{ collection.description }}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex flex-col items-end gap-sm">

      <!-- Workspace -->
      <Badge v-if="collection.workspace?.name === 'nanoworks'" class="badge-success badge-sm">
        by Nanoworks
      </Badge>

      <span v-else class="text-sm text-subtle">
        by {{ collection.workspace?.name }}
      </span>

      <!-- Categories -->
      <div class="flex gap-sm">
        <Badge v-for="category in categoriesPurpose" :key="category.name" class="badge-primary badge-sm badge-light">
          {{ category.title }}
        </Badge>
      </div>
    </div>
  </BaseButton>
</template>
