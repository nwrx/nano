<script setup lang="ts">
import type { RegistryCollectionObject, RegistryComponentObject } from '@nwrx/nano-api'
import { vMarkdown } from '#imports'

const props = defineProps<{
  collection: RegistryCollectionObject
  components: RegistryComponentObject[]
}>()

function getSpecifier(component: RegistryComponentObject) {
  const workspace = props.collection.workspace?.name
  const collection = props.collection.name

  return [
    workspace === 'nanoworks' ? undefined : workspace,
    collection === 'nano' ? undefined : collection,
    component.name,
  ].filter(Boolean).join('/')
}
</script>

<template>
  <div class="w-full ml-md p-lg b-l b-app">
    <div class="w-full h-96 overflow-hidden flex bg-subtle rd b b-app">

      <!-- Left panel - Collection summary -->
      <div class="w-1/2 h-full p-lg overflow-y-auto overflow-x-hidden">
        <h3 class="text-lg font-semibold space-x-sm mb-lg" v-text="collection.title" />
        <div :key="collection.summary" v-markdown="collection.summary" class="markdown text-justify" />
      </div>

      <!-- Right panel - Components -->
      <div class="w-1/2 h-full max-w-lg overflow-y-auto overflow-x-hidden b-l b-app">
        <div
          v-for="component in components"
          :key="component.name"
          class="flex items-center gap-md p-md bg-subtle rd b-b b-app mb-md">

          <!-- Title & Icon -->
          <BaseIcon :icon="component.icon" class="size-6 rd text-white" load />

          <!-- <h4 class="text-base line-clamp-1" v-text="component.title" /> -->
          <span class="text-sm font-mono bg-emphasized b b-emphasized px-sm py-xs rd">
            {{ getSpecifier(component) }}
          </span>

          <!-- Socket dots -->
          <div class="grow" />

          <div class="flex gap-xs">
            <BaseIcon
              v-for="color in getComponentSocketColors(component)"
              :key="color"
              :style="{ color }"
              icon="i-carbon:circle-solid"
              class="size-3 inline-block"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
